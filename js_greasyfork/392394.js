// ==UserScript==
// @name         CS-Dashboard-Transcription-Summary-Stats
// @namespace    http://tampermonkey.net/
// @version      0.4.3
// @description  Display transcription summary stats on dashboard
// @author       my-cs-account
// @match        https://work.crowdsurfwork.com/reports/work_data/*
// @downloadURL https://update.greasyfork.org/scripts/392394/CS-Dashboard-Transcription-Summary-Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/392394/CS-Dashboard-Transcription-Summary-Stats.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const summary_table_id = 'CS_SUMMARY_TABLE_ID';
    const summary_tbody_id = 'CS_SUMMARY_TBODY_ID';
    const summary_tfoot_id = 'CS_SUMMARY_TFOOT_ID';

    function create_table_row(cell_tag_name, contents)
    {
        let row = document.createElement('tr');
        for (let i = 0; i < contents.length; i++)
        {
            let cell = document.createElement(cell_tag_name);
            cell.innerHTML = contents[i];
            row.appendChild(cell);
        }

        return row;
    }

    function install_summary_table()
    {
        let summary_table = document.getElementById(summary_table_id);
        if (summary_table) return;

        summary_table = document.createElement('table');
        summary_table.setAttribute('class', 'table table-hover table-striped responsive dataTable');
        summary_table.setAttribute('id', summary_table_id);
        let thead = document.createElement('thead');
        thead.appendChild(create_table_row('th', ['Date', '# Submitted', 'Approved Paid', 'Approved Unpaid', 'Pending Estimated Pay', 'Approved+Estimated Pay']));
        let tbody = document.createElement('tbody');
        tbody.setAttribute('id', summary_tbody_id);
        tbody.appendChild(create_table_row('td', ['0000-00-00', 0, '0/$0.00', '0/$0.00', '0/$0.00', '$0.00']));
        let tfoot = document.createElement('tfoot');
        tfoot.setAttribute('id', summary_tfoot_id);
        tfoot.appendChild(create_table_row('th', ['<b>Totals:</b>', '<b>0</b>', '<b>0/$0.00</b>', '<b>0/$0.00</b>', '<b>0/$0.00</b>']));

        summary_table.appendChild(thead);
        summary_table.appendChild(tbody);
        summary_table.appendChild(tfoot);

        let transcription = document.getElementById('transcription');
        transcription.appendChild(document.createElement('br'));
        transcription.appendChild(document.createElement('br'));
        transcription.appendChild(summary_table);
    }

    function get_transcription_tbody()
    {
        let transcription_table = document.getElementById('transcription_table');
        if (!transcription_table)
        {
            console.log("can't find transcription_table");
            return null;
        }

        for (let i = 0; i < transcription_table.childNodes.length; i++)
        {
            if (transcription_table.childNodes[i].tagName === 'TBODY')
            { return transcription_table.childNodes[i]; }
        }

        console.log("can't find TBODY in transcription table");
        return null;
    }

    function install_change_listener()
    {
        /* we can't just watch for the date filter to change, since we still need to
         * wait for the display to update. Instead, we'll just update everytime the
         * transcription rows are changed.
         */
        let transcription_rows = get_transcription_tbody();

        const observer = new MutationObserver((mutation_list, observer) => {
            //console.log('in mutation observer callback');
            update_summary_table();
        });

        observer.observe(transcription_rows, { childList: true });
    }

    function get_child_text(row, index)
    {
        if (index <= row.length)
        {
            let child = row[index].childNodes;
            return child[0].textContent;
        }

        return 'row.length=' + row.length + ' too short';
    }

    function parse_duration(duration)
    {
        // assume hh:mm:ss format
        if (!duration.match(/^\d\d:\d\d:\d\d$/)) return 0;
        let hhmmss = duration.split(':');
        let hh = parseInt(hhmmss[0]);
        let mm = parseInt(hhmmss[1]);
        let ss = parseInt(hhmmss[2]);
        return ss + 60*(mm + 60*hh);
    }

    function get_row_data(row)
    {
        if (!row) return null;
        let cells = row.childNodes;
        let date = get_child_text(cells, 0).substring(0,10) // strip off timestamp
        let duration = parse_duration(get_child_text(cells, 1));
        let status = get_child_text(cells, 2);
        let payment = parseFloat(get_child_text(cells, 6).substring(1)); // strip off leading $
        let receipt_id = get_child_text(cells, 7);
        return { date, duration, status, payment, receipt_id };
    }

    function make_initial_summary_object()
    {
        return {
            submitted: 0,
            approved_paid_count: 0,
            approved_paid_total: 0,
            approved_unpaid_count: 0,
            approved_unpaid_total: 0,
            pending_count: 0,
            pending_duration: 0,
            pending_paid_estimate: 0,
        };
    }

    function compute_summary()
    {
        let transcription_rows = get_transcription_tbody().childNodes;
        let summary = {};
        for(let i = 0; i < transcription_rows.length; i++)
        {
            if (transcription_rows[i].childNodes.length <= 1) continue;
            let row_data = get_row_data(transcription_rows[i]);
            if (!row_data) continue;
            if (!summary[row_data.date]) summary[row_data.date] = make_initial_summary_object();

            let day = summary[row_data.date];

            //console.log('row_data=', row_data);
            day.submitted++;
            if (row_data.status === 'APPROVED')
            {
                if (row_data.receipt_id !== '0')
                {
                    day.approved_paid_count++;
                    day.approved_paid_total += row_data.payment;
                }
                else
                {
                    day.approved_unpaid_count++;
                    day.approved_unpaid_total += row_data.payment;
                }
            }
            else if (row_data.status === 'PENDING_APPROVAL')
            {
                day.pending_count++;
                day.pending_duration += row_data.duration;
                let paid_duration = row_data.duration;

                // Normal pay for Media to text work is a half cent per second, rounded to the nearest penny.
                // There's a number of issues here that makes this inaccurate (might be General Content or
                // challenging audio, no way to know if a task rounded up or down), so this will generally be
                // a lower bound
                let estimated_pay = row_data.duration * 0.005;
                if (estimated_pay < 0.05) estimated_pay = 0.05; // pay out is never less than 5 cents
                if (estimated_pay > 0.12) estimated_pay = 0.12; // 25 second tasks always round down
                day.pending_paid_estimate += estimated_pay;
            }
        }

        //console.log('summary=', summary);
        return summary;
    }

    function money_round(amount) { return Math.round(amount*100)/100; }

    function money_format(amount)
    {
        return '$' + money_round(amount).toFixed(2);
    }

    function make_summary_row(date, summary_entry)
    {
        //console.log('in make_summary_row summary_entry=', summary_entry);
        let cell_tag_name = date === 'Totals' ? 'th' : 'td';
        let approved_paid_total = money_format(summary_entry.approved_paid_total);
        let approved_unpaid_total = money_format(summary_entry.approved_unpaid_total);
        let pending_paid_estimate = money_format(summary_entry.pending_paid_estimate);
        let total_paid = money_format(
            summary_entry.approved_paid_total +
            summary_entry.approved_unpaid_total +
            summary_entry.pending_paid_estimate);
        return create_table_row(cell_tag_name, [
            date,
            summary_entry.submitted,
            `${summary_entry.approved_paid_count}/${approved_paid_total}`,
            `${summary_entry.approved_unpaid_count}/${approved_unpaid_total}`,
            `${summary_entry.pending_count}/${pending_paid_estimate}`,
            total_paid
        ]);
    }

    function add_to_summary_total(total, entry)
    {
        total.submitted += entry.submitted;
        total.approved_paid_count += entry.approved_paid_count;
        total.approved_paid_total += entry.approved_paid_total;
        total.approved_unpaid_count += entry.approved_unpaid_count;
        total.approved_unpaid_total += entry.approved_unpaid_total;
        total.pending_count += entry.pending_count;
        total.pending_paid_estimate += money_round(entry.pending_paid_estimate);
    }

    function update_summary_table()
    {
        let summary = compute_summary();
        let totals = make_initial_summary_object();
        let summary_rows = [];
        Object.keys(summary).sort().forEach((key) => {
            summary_rows.push(make_summary_row(key, summary[key]));
            add_to_summary_total(totals, summary[key]);
        });

        let tbody = document.getElementById(summary_tbody_id);
        tbody.innerHTML = '';
        for (let i = 0; i < summary_rows.length; i++)
        {
            tbody.appendChild(summary_rows[i]);
        }

        let tfoot = document.getElementById(summary_tfoot_id);
        let total_row = make_summary_row('Totals', totals);
        tfoot.innerHTML = '';
        if (summary_rows.length > 1) tfoot.appendChild(total_row);
    }

    function script_init()
    {
        //console.log('readyState = ', document.readyState);
        if (document.readyState !== 'complete') return false;

        console.log('in script_init');
        install_summary_table();
        install_change_listener();
        update_summary_table();
        return true;
    }

    if (!script_init())
    { document.addEventListener('readystatechange', (event) => script_init()); }
})();
