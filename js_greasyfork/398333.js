// ==UserScript==
// @name travelSFC
// @namespace http://tampermonkey.net/
// @version 1.5
// @description show faction and company while flying
// @author You
// @match https://www.torn.com/factions.php*
// @match https://www.torn.com/joblist.php*
// @match https://www.torn.com/preferences.php*
// @grant none
// @run-at document-end

/* globals jQuery, $, waitForKeyElements */
// @downloadURL https://update.greasyfork.org/scripts/398333/travelSFC.user.js
// @updateURL https://update.greasyfork.org/scripts/398333/travelSFC.meta.js
// ==/UserScript==
(function () {
    "use strict"; // check for apikey and get it from user

    var apiKey;

    if (localStorage.XrayApiKey === null || localStorage.XrayApiKey === undefined) {
        console.log('api is null');

        if (window.location.href.includes('preferences.php')) {
            var checkExist = function checkExist() {
                if (!$("input.input___1n_f_").size() || $("input.input___1n_f_").val() === undefined || $("input.input___1n_f_").val() === '') {
                    console.log('retry', $("input.input___1n_f_").val());
                    window.requestAnimationFrame(checkExist);
                } else {
                    console.log($("input.input___1n_f_").val());
                    if (confirm('Allow travelShowFC to use your apiKey?')) window.localStorage.XrayApiKey = $('input.input___1n_f_').val();
                }
            };

            document.getElementsByTagName('a').addEventListener('onclick', checkExist(), false);
            checkExist();
        } else {
            var child = document.createElement('div');
            var span = document.createElement('span');

            span.onclick = function () {
                this.parentElement.parentElement.removeChild(this.parentElement);
            };

            span.innerHTML = '&times;';
            span.style = "margin-left: 25px;color:white;font-weight:bold;\nfloat: right;font-size:30px;line-height:20px;cursor:pointer;";
            child.style = "z-index:99999;width:100%;height:auto;position:fixed;top:0px;\ntext-align:center;background-color:orange;color:white;padding-bottom:1%;padding-top:1%;";
            child.innerHTML = '<strong>Warning!</strong> Go to the <a href="https://www.torn.com/preferences.php#tab=api">prefrencepage</a> to allow apikey use <br><br> or do it manualy: <input type="text" id="apiKeyInput">';
            child.appendChild(span);
            document.body.appendChild(child);

            document.getElementById('apiKeyInput').onkeyup = function (e) {
                if(e.keyCode==13){
                    if (confirm('Allow travelShowFC to use '+e.target.value+' as your apiKey?')) window.localStorage.XrayApiKey = e.target.value;
                }
            };

        }
        return;
    } else {
        apiKey = window.localStorage.XrayApiKey;
    } //end apikey part

    //test if flying
    var element = document.getElementsByClassName('travelling');
    if (element.length < 1) return;
    console.log('traveling');
    var factionStyle = "<link rel=\"stylesheet\" type=\"text/css\" href=\"https://www.torn.com/css/style/faction/faction_info.css\">\n<link rel=\"stylesheet\" type=\"text/css\" href=\"https://www.torn.com/css/style/faction/faction.css\">\n<link rel=\"stylesheet\" type=\"text/css\" href=\"https://www.torn.com/css/style/faction/faction_chain.css\">\n<link rel=\"stylesheet\" type=\"text/css\" href=\"https://www.torn.com/css/style/faction/faction_war.css\">";
    var companyStyle = "\n<link rel=\"stylesheet\" type=\"text/css\" href=\"https://www.torn.com/css/style/job_lists/job_lists.css\">\n<link rel=\"stylesheet\" type=\"text/css\" href=\"https://www.torn.com/css/style/job_lists/job_lists_apply.css\">";
    var userUrl = window.location.href;

    if (userUrl.includes("joblist.php") || userUrl.includes("factions.php")) {
        document.getElementsByClassName('right-round')[0].innerHTML = "<center><img src=\"/images/v2/main/ajax-loader.gif\"></center>";
        var company_faction = userUrl.includes("joblist.php");
        document.head.innerHTML += company_faction ? companyStyle : factionStyle;

        if (userUrl.includes("userID")) {
            getID();
        } else if(userUrl.includes("ID")) {
            let e = userUrl.split('ID=')[1].replace('#','');
            if(e.substring(e.length - 1,e.length) == "/")e =e.substring(0, e.length - 1);
            let tempUrl = company_faction ? "https://api.torn.com/company/" + e + "?selections=profile&key=" : "https://api.torn.com/faction/" + e + "?selections=basic,territory,chain&key=";
            tempUrl += apiKey;
            console.log(tempUrl);
            getData(tempUrl);
        } else if(userUrl.includes("step=your")){
            let tempUrl = company_faction ? "https://api.torn.com/company/" : "https://api.torn.com/faction/";
            tempUrl += "?selections=basic,territory,chain&key="+apiKey;
            getData(tempUrl);
        }
    }

    function getID() {
        var userFetchUrl = "https://api.torn.com/user/" + userUrl.split('userID=')[1] + "?selections=profile&key=" + apiKey;
        fetch(userFetchUrl).then(function (response) {
            return response.json();
        }).then(function (data) {
            var tempUrl = company_faction ? "https://api.torn.com/company/" + data.job.company_id + "?selections=profile&key=" + apiKey : "https://api.torn.com/faction/" + data.faction.faction_id + "?selections=basic,territory,chain&key=" + apiKey;
            getData(tempUrl);
        }).catch(function (e) {
            console.error(e);
        });
    }

    function getData(url) {
        fetch(url).then(function (response) {
            return response.json();
        }).then(function (data) {
            if('error' in data){console.log("TravelFC:"+data.error.error);return;}
            document.getElementById('mainContainer').innerHTML = company_faction ? showCompany(data) : showFaction(data);
        }).catch(function (e) {
            console.error(e);
        });
    }

    function showFaction(data) {
        try {
            var factionId = data.ID;
            var factionName = data.name;
            var respect = data.respect;
            var leaderId = data.leader;
            var leaderName = data.members[leaderId].name;
            var coleaderId = data['co-leader'];
            var coleaderName = coleaderId !== 0 ? data.members[coleaderId].name : 'none';
            var memberCount = Object.keys(data.members).length;
            var bestChain = data.best_chain;
            var territory = data.territory;
            var territoryCount = territory !== null ? Object.keys(territory).length : '0';
            var memberHtml = '';
            var memberIds = Object.keys(data.members);
            var inWar = data.territory_wars[0] !== undefined ? true : false;
            var chainCount = data.chain.current;
            var activeChain = chainCount > 0 ? true : false;
            var timeLeftToChain = new Date(1000 * data.chain.timeout).toISOString().substr(14, 5);
            window.timeout = timeLeftToChain;
            memberIds.forEach(function (memberId) {
                var member = data.members[memberId];
                var memberName = member.name;
                var memberLvl = 'NA';
                var memberDaysFaction = member.days_in_faction;
                var memberStatus = member.status.state;
                var statusColor = member.status.color;
                var icon = member.last_action.status == 'Offline' ? 'icon2' : member.last_action.status == 'Online' ? 'icon1' : 'icon62';
                memberHtml += "\n<li>\n<div class=\"member icons\">\n<ul id=\"iconTray\" class=\"big svg singleicon\" style=\"display: inline-block;\">\n<li id=\"" + icon + "\" class=\"iconShow\" title=\"<b>Offline</b>\" style=\"\"></li>\n</ul><span class=\"m-hide\"><a class=\"user name\" data-placeholder=\"" + memberName + " [" + memberId + "]\" href=\"/profiles.php?XID=" + memberId + "\">" + memberName + " [" + memberId + "]<div></div></a></span><span class=\"m-show\"><a class=\"user name\" data-placeholder=\"" + memberName + " [" + memberId + "]\" href=\"/profiles.php?XID=" + memberId + "\">" + memberName + " [" + memberId + "]<div></div></a> </span>\n</div>\n<div class=\"arrow-wrap right\"><i class=\"arrow-999\"></i></div>\n<div class=\"acc-wrap\">\n<div class=\"lvl\"><span class=\"t-show\">Level:</span>" + memberLvl + "</div><div class=\"member-icons\"><span class=\"t-show\">Icons:</span><ul id=\"iconTray\" class=\"big svg singleicon\" style=\"display: inline-block;\"><li id=\""+((memberId == leaderId || memberId == coleaderId)?"icon74":"icon9")+"-profile-"+memberId+"\" class=\"user-status-16-Faction left\"><a href=\"factions.php?step=profile&amp;userID="+memberId+"\"></a></li>"+((memberStatus == 'Traveling' || memberStatus == 'Abroad')?'<li id="icon71" class="user-status-16-Travelling left"></li>':'')+((memberStatus == 'Hospital')?'<li id="icon15" class="user-status-16-Hospital left"><a href="hospitalview.php"></a></li>':'')+((memberStatus == 'Fallen')?'<li id="icon77" class="user-status-16-Fallen left"></li>':'')+"</ul></div>\n<div class=\"info-wrap right\">\n<div class=\"days\"><span class=\"t-show\">Days:</span>" + memberDaysFaction + "</div>\n<div class=\"status\"><span class=\"t-show\">Status:</span><span class=\"t-" + statusColor + "\">" + memberStatus + "</span></div>\n<div class=\"clear\"></div>\n</div>\n<div class=\"clear\"></div>\n</div>\n<div class=\"clear\"></div>\n</li>";
          });
            var endHtml = "<div class=\"content-wrapper m-left20 left winter no-precipitation \" role=\"main\">\n<div class=\"content-title m-bottom10\">\n<h4 id=\"skip-to-content\" class=\"left\">Faction</h4>\n<div class=\"clear\"></div>\n<hr class=\"page-head-delimiter\">\n</div>\n<div id=\"factions\">\n<div class=\"faction-info-wrap another-faction\">\n<div class=\"title-black top-round m-top10\" role=\"heading\" aria-level=\"5\"> " + factionName + "</div>\n<div class=\"faction-info bottom-round\" data-faction=\"\">\n<div class=\"f-info-wrap left\">\n<ul class=\"f-info\">\n<li><span class=\"bold\">Leader:</span><a class=\"t-blue-d h\" href=\"/profiles.php?XID=" + leaderId + "\"> " + leaderName + "</a> </li>\n<li><span class=\"bold\">Co-Leader:</span><a class=\"t-blue-d h\" href=\"/profiles.php?XID=" + coleaderId + "\"> " + coleaderName + "</a> </li>\n<li><span class=\"bold\">Members:</span> " + memberCount + "</li>\n<li><span class=\"bold\">Best chain:</span> " + bestChain + "</li>\n<li><span class=\"bold\">Territories:</span><a class=\"t-blue-d h\" href=\"/city.php#factionID=" + factionId + "\"> " + territoryCount + "</a></li>\n<li><span class=\"bold\">Treaties:</span>0 </li>\n</ul>\n<div class=\"clear\"></div>\n</div>\n<div class=\"clear\"></div>\n</div>\n</div>\n<hr class=\"delimiter-999 m-top10\">\n<div class=\"f-msg m-top10" + (inWar ? ' red' : '') + "\">\n<div class=\"l\"></div><div class=\"r\"></div>\n<div class=\"rank-icon left\"></div>\n<div class=\"respect-icon right\"></div>\n<span class=\"title\"> THIS FACTION IS" + (inWar ? ' ' : ' NOT ') + "IN A WAR </span>\n<div class=\"rank\">TIER: NA</div><div class=\"respect\">RESPECT: " + respect + "</div>\n<div class=\"clear\"></div></div>\n<ul class=\"f-war-list war-new\">\n<li class=\"warListItem___AXFi0 first-in-row " + (activeChain ? 'green green' : 'no-active no-active') + "\">\n<a style=\"text-decoration: none;\"><div class=\"chain-box\"><div class=\"chain-box-title-block\"><span class=\"chain-box-title\">" + (activeChain ? 'Chain active' : 'No active chain') + "</span><i class=\"chain-war-icon\"></i></div><div class=\"chain-box-stats-block\"><div class=\"chain-box-general-info\"><span class=\"chain-box-top-stat\">NA</span><span class=\"chain-box-center-stat\" id=\"chain\">" + chainCount + "</span><span class=\"chain-box-timeleft\" id=\"timeout\">" + timeLeftToChain + "</span></div></div></div></a></li><li class=\"inactive\"></li><li class=\"inactive\"></li><li class=\"clear\"></li></ul>\n<hr class=\"delimiter-999 m-top10\">\n<div class=\"clear\"></div>\n<div class=\"faction-info-wrap another-faction\">\n<div class=\"f-war-list m-top10\">\n<ul class=\"title title-black top-round\">\n<li class=\"desk\" role=\"heading\" aria-level=\"5\">" + memberCount + " Faction Members</li>\n<li class=\"lvl\">Level</li>\n<li class=\"member-icons\">Icons</li>\n<li class=\"days\">Days</li>\n<li class=\"status\">Status</li>\n<li class=\"act\">Kick</li>\n</ul>\n<ul class=\"member-list info-members bottom-round t-blue-cont h\">" + memberHtml + "</ul>\n</div>\n</div>\n</div>\n</div>";
            chainUpdate(factionId);
            return endHtml;
        } catch (error) {
            console.error(error);
        }
    }

    function showCompany(data) {
        data = data.company;
        var companyName = data.name;
        var companyType = data.company_type;
        var companyAge = data.days_old;
        var dailyIncome = data.daily_profit;
        var weeklyIncome = data.weekly_profit;
        var dailyCostumers = data.daily_customers;
        var weeklyCostumers = data.weekly_customers;
        var directorId = data.director;
        var directorName = data.employees[directorId].name;
        var hired = data.employees_hired;
        var capacity = data.employees_capacity;
        var employeeHtml = '';
        var employees = data.employees;
        var employeeIds = Object.keys(data.employees);
        employeeIds.forEach(function (employeeId) {
            var employee = employees[employeeId];
            var employeeName = employee.name;
            var employeeLvl = 'NA';
            employeeHtml += "<li>\n<ul class=\"item icons\">\n<li class=\"employee\">\n<ul id=\"iconTray\" class=\"big svg singleicon\" style=\"display: inline-block;\">\n<li id=\"icon2___fbdaf888\" class=\"iconShow\" title=\"<b>Offline</b>\" style=\"\"></li>\n</ul><a class=\"user name\" data-placeholder=\"" + employeeName + " [" + employeeId + "]\" href=\"/profiles.php?XID=" + employeeId + "\" 0=\"\"> " + employeeName + " [" + employeeId + "]</a>\n</li>\n<li class=\"rank t-overflow\">\n<span class=\"t-show bold\">Rank:</span>employeeRank</li>\n<li class=\"lvl\">" + employeeLvl + "</li>\n<li class=\"status\">\n<ul id=\"iconTray\" class=\"big svg\" style=\"display: inline-block;\">NA</ul>\n</li>\n<li class=\"clear\"></li>\n</ul>\n<div class=\"clear\"></div>\n</li>";
        });
        var starCount = data.rating;
        var starsHtml = '';

        for (var i = 1; i < 11; i++) {
            var starState = i < starCount ? 'active' : 'inactive';
            starsHtml += "<li class=\"star-icon " + starState + "\" title=\"" + starCount + " Star Company\"></li>";
        }

        var endHtml = "<div class=\"content-wrapper m-left20 left winter\" role=\"main\">\n<div class=\"content-title m-bottom10\">\n<h4 id=\"skip-to-content\" class=\"left\">\nJob Listing\n</h4>\n\n<div class=\"links-top-wrap \">\n<button id=\"top-page-links-button\" class=\"links-top-arrow wai-btn\" aria-label=\"Top page links\"></button>\n<div id=\"top-page-links-list\" class=\"content-title-links\" role=\"list\" aria-labelledby=\"top-page-links-button\">\n<div class=\"left-side\"></div>\n<div class=\"right-side\"></div>\n<div class=\"links-header\">\n<div class=\"l\"></div>\n</div>\n\n<div class=\"links-footer\">\n<div class=\"l\"></div>\n<div class=\"r\"></div>\n</div>\n</div>\n</div>\n<div class=\"clear\"></div>\n<hr class=\"page-head-delimiter\">\n</div>\n<div></div>\n\n<div class=\"company-details m-top10\">\n<div class=\"title-black top-round\" role=\"heading\" aria-level=\"5\">\n<span class=\"m-hide\">Details of</span> " + companyName + "<span class=\"m-hide\">- " + companyType + "</span>\n</div>\n<div class=\"details-wrap active\">\n\n<ul class=\"info\">\n<li class=\"m-title\">\n<span class=\"arrow-left right m-show\"></span>\n<span class=\"m-show\">" + companyType + "</span>\n<ul class=\"ranks light\" id=\"ui-id-2\">\n" + starsHtml + "\n</ul>\n<span class=\"clear\"></span>\n</li>\n<li class=\"m-hide\">\nType: " + companyType + " </li>\n<li>\nDirector: <a class=\"t-white h\" href=\"profiles.php?XID=" + directorId + "\"> " + directorName + "</a>\n</li>\n<li>\nAge: " + companyAge + " </li>\n</ul>\n<ul class=\"info\">\n<li>\nDaily income: $" + dailyIncome + " </li>\n<li>\nWeekly income: $" + weeklyIncome + " </li>\n<li>\nDaily customers: " + dailyCostumers + " </li>\n<li>\nWeekly customers: " + weeklyCostumers + " </li>\n</ul>\n<div class=\"clear\"></div>\n</div>\n\n</div>\n<hr class=\"delimiter-999 m-top10 m-bottom10\">\n<div class=\"employees-wrap\">\n<div class=\"title-black top-round\">\n<ul class=\"title\">\n<li class=\"employee\" role=\"heading\" aria-level=\"5\">" + hired + " / " + capacity + " Company Employees</li>\n<li class=\"rank\">Job Title</li>\n<li class=\"lvl\">Level</li>\n<li class=\"status\">Status</li>\n<li class=\"clear\"></li>\n</ul>\n</div>\n<ul class=\"employees-list cont-gray bottom-round\">\n" + employeeHtml + "\n\n</ul>\n</div>\n<div class=\"doctorn-widgets doctorn-widgets--bottom\"></div>\n<div></div>\n</div>";
        return endHtml;
    }

    function TimeoutUpdate() {
        var timeoutStart = setInterval(function () {
            var el = document.getElementById("timeout");
            var elHtml = el.innerHTML;

            if (elHtml == '00:00'){document.getElementById("chain").innerHTML = 0; return;}
            var elInt = parseInt(elHtml.split(':')[0]) * 60 + parseInt(elHtml.split(':')[1]) - 1;
            var elNewHtml = new Date(1000 * elInt).toISOString().substr(14, 5);
            el.innerHTML = elNewHtml;
        }, 1000);
    }

    function chainUpdate(id) {
        var chain = setInterval(function () {
            var el = document.getElementById("chain");
            var elRefresh = document.getElementById("timeout");
            var chainUrl = "https://api.torn.com/faction/" + id + "?selections=chain&key=" + apiKey;
            fetch(chainUrl).then(function (response) {
                return response.json();
            }).then(function (data) {
                if (parseInt(el.innerHTML) !== parseInt(data.chain.current)) elRefresh.innerHTML = '05:00';
                if(data.chain.current == '0')elRefresh.innerHTML = '00:00';
                el.innerHTML = data.chain.current;
            }).catch(function (e) {
                console.error(e);
            });
        }, 40000);
        TimeoutUpdate();
    }
})();