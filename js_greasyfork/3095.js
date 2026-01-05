// ==UserScript==
// @name        mmmturkeybacon Add Hidden Stats to Dashboard
// @version     2.00
// @description Adds submission, return, and abandonment_rates to the dashboard. Saves stats and only updates them when "Update stats" is clicked to reduce page requests.
// @author      mmmturkeybacon
// @namespace   http://userscripts.org/users/523367
// @include     https://www.mturk.com/mturk/dashboard
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/3095/mmmturkeybacon%20Add%20Hidden%20Stats%20to%20Dashboard.user.js
// @updateURL https://update.greasyfork.org/scripts/3095/mmmturkeybacon%20Add%20Hidden%20Stats%20to%20Dashboard.meta.js
// ==/UserScript==

// Thanks to TheFrostlixen for showing me an alternative way to get the stats.

$(document).ready(function()
{
    var MPRE_CNT_MAX = 5;
    var qualification_dict = {};
    qualification_dict['submission_rate'] = {'qualificationId': '00000000000000000000', 'value': GM_getValue('submission_rate', '?%')};
    qualification_dict['return_rate'] = {'qualificationId': '000000000000000000E0', 'value': GM_getValue('return_rate', '?%')};
    qualification_dict['abandonment_rate'] = {'qualificationId': '00000000000000000070', 'value': GM_getValue('abandonment_rate', '?%')};
    var qualification_names = ['submission_rate', 'return_rate', 'abandonment_rate'];
    var request_loop_running = false;
    var stat_request_running = false;
    var success = false;
    var mpre_cnt = 0;
    var error = false;

    function stat_request(qualification_name)
    {
        stat_request_running = true;
        success = false;

        $.ajax(
        {
            url: 'https://www.mturk.com/mturk/requestqualification?qualificationId='+qualification_dict[qualification_name].qualificationId,
            type: 'GET',
            success: function(data)
            {
                var $src = $(data);
                var maxpagerate = $src.find('td[class="error_title"]:contains("You have exceeded the maximum allowed page request rate for this website.")');
                if (maxpagerate.length == 0)
                {
                    qualification_dict[qualification_name].value = $src.find('td[id="qualification_score"]:contains("Qualification Value")').next().text().trim() + '%';
                    $('td[id="'+qualification_name+'"]').html('&#10004');
                    success = true;
                }
                else
                {
                    $('td[id="'+qualification_name+'"]').html('&#10006');
                    mpre_cnt++;
                    if (mpre_cnt >= MPRE_CNT_MAX)
                    {
                        error = true;
                        alert('mmmturkeybacon Add Hidden Stats to Dashboard: too many max page request rate errors');
                    }
                }
                stat_request_running = false;
            },
            error: function(xhr, status, error)
            {
                $('td[id="'+qualification_name+'"]').html('&#10006');
                error = true;
                alert('mmmturkeybacon Add Hidden Stats to Dashboard: timeout error');
                stat_request_running = false;
            },
            timeout: 3000
        });
    }

    function request_loop(i)
    {
        request_loop_running = true;

        if (error == false)
        {
            if (stat_request_running == false)
            {
                if (success == true)
                {
                    i++;
                    if (i < qualification_names.length)
                    {
                        stat_request(qualification_names[i]);
                        setTimeout(function(){request_loop(i)}, 500);
                    }
                    else
                    {
                        GM_setValue('submission_rate', qualification_dict['submission_rate'].value);
                        GM_setValue('return_rate', qualification_dict['return_rate'].value);
                        GM_setValue('abandonment_rate', qualification_dict['abandonment_rate'].value);
                        var $submitted_table = $('th[id="hit_totals.desc_dolumn_header.tooltop.1"]').parents('td[width="50%"]');

                        $('td[id="submission_rate"]').text(qualification_dict['submission_rate'].value);
                        $('td[id="return_rate"]').text(qualification_dict['return_rate'].value);
                        $('td[id="abandonment_rate"]').text(qualification_dict['abandonment_rate'].value);
                        request_loop_running = false;
                    }
                }
                else
                {
                    stat_request(qualification_names[i]);
                    setTimeout(function(){request_loop(i)}, 500);
                }
            }
        }
        else
        {
            request_loop_running = false;
        }
    }

    var $submitted_table = $('th[id="hit_totals.desc_dolumn_header.tooltop.1"]').parents('td[width="50%"]');

    $submitted_table.before('<td width="50%"><table class="metrics-table" width="100%" style="display: inline-block"><tr class="metrics-table-header-row"><th class="metrics-table-first-header"><a id="hit_totals.desc_dolumn_header.tooltop.2" class="metrics-table-first-header">HITs You Have Accepted</a>&nbsp;<a id="mtb_update_stats" class="whatis" style="display: inline-block; cursor: pointer">(Update stats)</a></th><th id="user_metrics.rate_column_header.tooltip.2">Rate</th><tr class="odd"><td class="metrics-table-first-value">HITs Accepted</td><td>&mdash;</td></tr><tr class="even"><td class="metrics-table-first-value">... Submitted</td><td id="submission_rate">'+qualification_dict['submission_rate'].value+'</td></tr><tr class="odd"><td class="metrics-table-first-value">... Returned</td><td id="return_rate">'+qualification_dict['return_rate'].value+'</td></tr><tr class="even"><td class="metrics-table-first-value">... Abandoned</td><td id="abandonment_rate">'+qualification_dict['abandonment_rate'].value+'</td></tr></table></td>');

    $('a[id="mtb_update_stats"]').bind('click', function()
    {
        if (request_loop_running == false)
        {
            request_loop_running = true;
            stat_request_running = false;
            success = false;
            mpre_cnt = 0;
            error = false;
            $('td[id="submission_rate"]').text('?%');
            $('td[id="return_rate"]').text('?%');
            $('td[id="abandonment_rate"]').text('?%');
            request_loop(0);
        }
    });
});