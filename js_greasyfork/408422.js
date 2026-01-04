// ==UserScript==
// @name         BTN Extension
// @namespace    https://broadcasthe.net/
// @version      0.1.0
// @description  Minor alterations to the website and adding functionalities
// @author       Glorious
// @match        http*://broadcasthe.net/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/408422/BTN%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/408422/BTN%20Extension.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $q = jQuery;
    if(location.href.indexOf("user.php?id=") > 0) {
        $q("div.head.colhead b:contains('Stamps') span").before(`(${$q("div.pad.center .toolTip").length})`);
    }

    else if(location.href.indexOf("bonus.php?action=rate") > 0)
    {
        var pagesize = $q("select.pagesize").append('<option value="999999999">&infin;</option>');

        var a = $q("#myTable")[0].config.rowsCopy;
        var episodes = 0, seasons = 0, s_total = 0, e_total = 0;
        var s_months = [], e_months = [];
        var rate_15m = 0, rate_1h = 0, rate_1d = 0, rate_1m = 0;
        for(var i=0; i<a.length; i++)
        {
            var b = a[i][0];
            var _15m = 0, _1h = 0, _1d = 0, _1m = 0, _months = 1, _multi = 1;
            var _tsize = b.children[2].textContent;
            if(_tsize.endsWith("MB"))
                _tsize = parseFloat(_tsize)/1024;
            else if(_tsize.endsWith("TB"))
                _tsize = parseFloat(_tsize)*1024;
            else
                _tsize = parseFloat(_tsize);
            _tsize = Math.round(_tsize * 100)/100;
            _multi = parseFloat(b.children[4].textContent.replace('x',''));

            _15m = parseFloat(b.children[5].textContent.replace(/,/g,''));
            _1h = parseFloat(b.children[6].textContent.replace(/,/g,''));
            _1d = parseFloat(b.children[7].textContent.replace(/,/g,''));
            _1m = parseFloat(b.children[8].textContent.replace(/,/g,''));

            var _size = b.children[2].textContent;
            var size = parseInt(_size);
            if(_size.endsWith("MB"))
                size *= 1048576;
            else if(_size.endsWith("GB"))
                size *= 1073741824;
            else if(_size.endsWith("TB"))
                size *= 1099511627776;
            var tds = b.children[1].textContent;
            if(tds == "Episode")
            {
                episodes++;
                e_total += size;
                var months = parseFloat(b.children[3].textContent);
                if(!isNaN(months))
                {
                    if(isNaN(e_months[months-1]))
                        e_months[months-1] = 0;
                    e_months[months-1]++;
                }
            }
            else if(tds == "Season")
            {
                seasons++;
                _months = parseInt(b.children[3].textContent);
                s_total += size;
                months = parseInt(b.children[3].textContent);
                if(!isNaN(months))
                {
                    if(isNaN(s_months[months-1]))
                        s_months[months-1] = 0;
                    s_months[months-1]++;
                }
            }

            if(_15m && _1h && _1d && _1m)
            {
                rate_15m += _15m;
                rate_1h += _1h;
                rate_1d += _1d;
                rate_1m += _1m;
            }
        }
        var fix = $q("td:contains('Total Seeding Size')").parent().next()[0].children;
        if(fix[2].innerHTML == "inf")
        {
            fix[2].innerHTML = Number(rate_15m.toFixed(3)).toLocaleString();
            fix[3].innerHTML = Number(rate_1h.toFixed(2)).toLocaleString();
            fix[4].innerHTML = Number(rate_1d.toFixed(2)).toLocaleString();
            fix[5].innerHTML = Number(rate_1m.toFixed(2)).toLocaleString();
        }

        var totals_table = $q("div.box.pad.center");
        totals_table.prev().prev().remove();
        var totals_header = totals_table.prev();
        totals_table.prev().remove();
        totals_table.remove();
        $q(totals_header[0].outerHTML + totals_table[0].outerHTML).insertBefore($q("h3:contains('Bonus Rates')"));

        $q(".box.pad.center").append('<br><table><tbody id="glorious"><tr class="colhead"><td>Type</td><td>Months</td><td>Count</td></tr></tbody></table>');
        var season_months = "", episode_months = "";
        var inserted_months = 0, total_months = 0, total_episodes = 0;
        for(i=0; i<s_months.length; i++)
        {
            if(!isNaN(s_months[i]))
                total_months++;
        }
        for(i=0; i<s_months.length; i++)
        {
            if(!isNaN(s_months[i]))
            {
                var colspan = 2;
                if(inserted_months++ % 3 == 0)
                {
                    if(!season_months) season_months += "<table><tr>";
                    else season_months += "</tr><tr>";
                }
                if(total_months % 3 > 0 && inserted_months + (total_months % 3) - 1 >= total_months)
                    colspan = 6 / (total_months % 3);
                season_months += `<td colspan="${colspan}" style="width:1%">${i+1}M: ${s_months[i]}</td>`;
            }
        }
        if(season_months) season_months += "</tr></table>";
        inserted_months = total_months = 0;
        for(i=0; i<e_months.length; i++)
        {
            if(!isNaN(e_months[i]))
                total_months++;
        }
        for(i=0; i<e_months.length; i++)
        {
            if(!isNaN(e_months[i]))
            {
                colspan = 2;
                if(inserted_months++ % 3 == 0)
                {
                    if(!episode_months) episode_months += "<table><tr>";
                    else episode_months += "</tr><tr>";
                }
                if(total_months % 3 > 0 && inserted_months + (total_months % 3) - 1 >= total_months)
                    colspan = 6 / (total_months % 3);
                episode_months += `<td colspan="${colspan}" style="width:1%">${i+1}M: ${e_months[i]}</td>`;
            }
        }
        if(episode_months) episode_months += "</tr></table>";
        $q("#glorious").append('<tr><td>Season</td><td style="width:413.6px">' + season_months + '</td><td>' + seasons + '</td></tr>');
        $q("#glorious").append('<tr><td>Episode</td><td>' + episode_months+ '</td><td>' + episodes + '</td></tr>');
        for(i=0; i<e_months.length; i++)
        {
            if(!isNaN(e_months[i]))
            {
                if(isNaN(s_months[i]))
                    s_months[i] = e_months[i];
                else
                    s_months[i] += e_months[i];
            }
        }
        season_months = "";
        inserted_months = total_months = 0;
        for(i=0; i<s_months.length; i++)
        {
            if(!isNaN(s_months[i]))
                total_months++;
        }
        for(i=0; i<s_months.length; i++)
        {
            if(!isNaN(s_months[i]))
            {
                colspan = 2;
                if(inserted_months++ % 3 == 0)
                {
                    if(!season_months) season_months += "<table><tr>";
                    else season_months += "</tr><tr>";
                }
                if(total_months % 3 > 0 && inserted_months + (total_months % 3) - 1 >= total_months)
                    colspan = 6 / (total_months % 3);
                season_months += `<td colspan="${colspan}" style="width:1%">${i+1}M: ${s_months[i]}</td>`;
            }
        }
        if(season_months) season_months += "</tr></table>";
        $q("#glorious").append('<tr><td>Total</td><td>' + season_months + '</td><td>' + (seasons+episodes) + '</td></tr>');
    }

    if(location.href.indexOf("bonus.php?action=stamps") > 0)
    {
        var stamps = $q("a[href*='action=takestamps']");
        var stamps_max = Math.floor(parseInt($q("#pointsStats").text().replace(/,/g, ''))/10000);
        stamps_max = Math.min(stamps_max, stamps.length);
        $q(".pad").append(`<br>Available: ${stamps.length} Stamps<br><input id="stampsbuynum" type="number" value="0" min="0" max="${stamps_max}" required style="width:50px;"> <input id="stampsbuy" type="button" value="Buy"> <input id="stampsbuymax" type="button" value="Buy Max">`)
        var bought = 0, threads_done = 0, running = false;
        function _buystamps(limit, threads=1, thread=1, count=0)
        {
            if(threads<1 || thread<1 || limit<1)
            {
                console.log("limit, threads and thread variables must be 1 or above (default = 1)")
                return;
            }
            var index = (thread-1)+(threads*count);
            if(index < limit)
                $q.ajax(stamps[index].href + "&return=networks").done(function() { console.log(++bought); $q("input[type='number']").val(bought); _buystamps(limit, threads, thread, ++count); });
            else
            {
                if(++threads_done >= threads && bought >= limit)
                {
                    setTimeout(function() {
                        alert(`Bought: ${Number(bought).toLocaleString()} stamps\nSpent: ${Number(bought*10000).toLocaleString()} bonus points`);
                        location.reload();
                    }, 50);
                }
            }
        }
        function buystamps(limit=1, threads=1)
        {
            if(threads < 1 || limit < 1)
                return console.log("limit and threads variables must be 1 or above (default = 1)");
            if(running)
                return console.log("Buying stamps process is already running.");
            running = true;
            bought = 0;
            threads_done = 0;
            $q("input[type='number']").val(0);
            for(var i=0; i<threads; i++)
                _buystamps(limit, threads, (i+1));
        }
        var eve;
        var allowed_keys = [ "Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown" ];
        $q("#stampsbuy").click(function() { var num = parseInt($q("#stampsbuynum").val()); if(!isNaN(num) && num >= 1) { if(confirm(`Are you sure you want to buy ${Number(num).toLocaleString()} stamp(s)?\nCost: ${Number(num*10000).toLocaleString()} bonus points`)) buystamps(num); } else alert("Number must be 1 or above."); });
        $q("#stampsbuymax").click(function() { if(confirm(`Are you sure you want to buy ${Number(stamps_max).toLocaleString()} stamp(s)?\nCost: ${Number(stamps_max*10000).toLocaleString()} bonus points`)) buystamps(stamps_max); });
        $q("#stampsbuynum").keydown(function(e) { eve=e; if(isNaN(parseInt(e.key)) && !allowed_keys.includes(e.key)) return false; else if(this.value[0] == "0") this.value = this.value.substr(1); })
            .on('input', function() { while(this.value.length > 1 && this.value[0] == '0') this.value = this.value.substr(1); if(!isNaN(parseInt(this.value))) { var val = parseInt(this.value), min = parseInt(this.min), max = parseInt(this.max); if(val > max) this.value = max; else if(val < min) this.value = min; } });
    }

    if(location.href.indexOf("upload.php") > 0)
    {
        a = $q("#scenename").val();
        if(a && (a.toLowerCase().indexOf("hebtv") > -1 || a.toLowerCase().indexOf("btn")) > -1)
        {
            $q("#origin").val("P2P").change();
            $q("#international_box").prop("checked", true).change();
            $q("#country").val(41).change();
            $q("#fasttorrent").prop("checked", true).change();
        }
    }

    function InitiateRankETA()
    {
        var eta_li = $q("#userinfo_stats");
        if(eta_li.length == 1)
        {
            var promotion = [ // [years,months,weeks,"name"]
                [0,0,2, "Member"], // Member
                [0,0,4, "Power User"], // Power User
                [0,0,12, "Extreme User"], // Extreme User
                [0,0,24, "Elite"], // Elite
                [0,0,36, "Guru"], // Guru
                [0,0,52, "Master"], // Master
                [0,0,152, "Overlord"] // Overlord
            ];
            function FindTargetPromotion()
            {
                for(var i=0; i<promotion.length; i++)
                {
                    var target = new Date(GM_getValue("btn_regdate"));
                    target.setYear(target.getFullYear() + promotion[i][0]);
                    //target.setMonth(target.getMonth() + promotion[i][1]);
                    target.setDate(target.getDate() + (7*promotion[i][2]));
                    if(target - Date.now() >= 0)
                    {
                        $q("#nextclass").text(promotion[i][3]);
                        return target;
                    }
                }
                return -1;
            }
            var ms_day = 86400000, ms_hour = 3600000, ms_minute = 60000, ms_second = 1000;
            eta_li = eta_li.append("<li><span id='nextclass'></span> ETA: <span style='color:white'></span></li>").find(":last");
            var target = -1;
            function GetETA()
            {
                var d = target - Date.now();
                if(d < 0)
                {
                    target = FindTargetPromotion();
                    if(target == -1)
                    {
                        eta_li.parent().remove();
                        return;
                    }
                    GetETA();
                    return;
                }
                var days = Math.floor(d / ms_day);
                if(days < 10)
                {
                    if(days == 0)
                        days = "";
                    else
                        days = "0" + days;
                }
                var hours = Math.floor(d % ms_day / ms_hour);
                if(hours < 10)
                {
                    if(hours == 0 && !days)
                        hours = "";
                    else
                        hours = "0" + hours;
                }
                var minutes = Math.floor(d % ms_day % ms_hour / ms_minute);
                if(minutes < 10)
                {
                    if(minutes == 0 && !days && !hours)
                        minutes = "";
                    else
                        minutes = "0" + minutes;
                }
                var seconds = Math.floor(d % ms_day % ms_hour % ms_minute / ms_second);
                if(seconds < 10)
                    seconds = "0" + seconds;
                eta_li.text(`${days ? days + "D:" : ''}${hours ? hours + "H:" : ''}${minutes ? minutes + "M:" : ''}${seconds}S`);
                setTimeout(GetETA, 1000);
            }
            GetETA();
        }
    }

    var regdate_storeval = "btn_regdate";
    var regdate = GM_getValue(regdate_storeval);
    var site_regdate = $q("li:contains('Joined: ') span");
    if(site_regdate && site_regdate.length > 0)
        site_regdate = site_regdate.attr("title");
    if(typeof site_regdate === 'string' && regdate != site_regdate)
    {
        regdate = site_regdate;
        GM_setValue(regdate_storeval, regdate);
    }
    if(typeof regdate === 'undefined')
    {
        jQuery.ajax("http://broadcasthe.net/user.php").done(function(res) {
            var site_regdate = $q(res).find("li:contains('Joined: ') span");
            if(site_regdate && site_regdate.length > 0)
            {
                GM_setValue(regdate_storeval, site_regdate.attr("title"));
                regdate = GM_getValue(regdate_storeval);
                InitiateRankETA();
            }
        });
    }
    else
        InitiateRankETA();
})();