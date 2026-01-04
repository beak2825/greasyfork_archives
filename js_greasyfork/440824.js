// ==UserScript==
// @name         Filtrer Harvest via la description
// @namespace    http://tampermonkey.net/
// @version      1.6.6
// @description  rechercher par description + edit depuis la page reports
// @author       celine@bebold
// @match        https://bebold.harvestapp.com/reports/*
// @icon         https://www.google.com/s2/favicons?domain=harvestapp.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/440824/Filtrer%20Harvest%20via%20la%20description.user.js
// @updateURL https://update.greasyfork.org/scripts/440824/Filtrer%20Harvest%20via%20la%20description.meta.js
// ==/UserScript==

(function() {

    function roundNum(num){
        return Math.round((parseFloat(num) + Number.EPSILON) * 100) / 100
    }
     function getPreviousSibling(elem, selector) {
        var sibling = elem.previousElementSibling;
        // If there's no selector, return the first sibling
        if (!selector) return sibling;
        // If the sibling matches our selector, use it
        // If not, jump to the next sibling and continue the loop
        while (sibling) {
            if (!sibling.hasAttribute(selector)) return sibling;
            sibling = sibling.previousElementSibling;
        }
    };
    function hourTohhmm(hours){
        var sign = hours < 0 ? "-" : "";
        var hour = Math.floor(Math.abs(hours));
        var min = Math.floor((Math.abs(hours) * 60) % 60);
        return sign + (hour < 10 ? "0" : "") + hour + "h" + (min < 10 ? "0" : "") + min;
    }
    function hhmmToHours(hours){
        var hh = hours.split('h')[0]
        var mm = hours.split('h')[1]
        return roundNum(parseFloat(hh)+parseFloat(mm)/60).toFixed(2);
    }
    function filterOutByDescription(descr){
        if(descr == "")
            location.reload();
        var tasksWithoutDescr = document.querySelectorAll('tr[data-analytics-day-entry-id]:not(.entry-has-notes )');
        tasksWithoutDescr.forEach((task) => {
            task.style.display = "none";
        });

        var tasksToHide = document.querySelectorAll('tr td[colspan="10"]');
        var totalTime = 0;
        tasksToHide.forEach((task) => {
            var rowID = task.parentNode.getAttribute('data-record-id');
            var taskRowData = document.querySelector('tr[data-analytics-day-entry-id="'+rowID+'"]');
            var taskTime = taskRowData.querySelector('.pds-text-right').innerHTML;
            if(task.outerText.toLowerCase().includes(descr.toLowerCase())){
                totalTime += parseFloat(taskTime);

            }
            else{
                task.parentNode.style.display = "none";
                taskRowData.style.display = "none";
                var rowHeader = getPreviousSibling(taskRowData, 'data-record-id');
                var headerTime = rowHeader.querySelector('.pds-text-right');
                headerTime.innerHTML = roundNum(roundNum(headerTime.innerHTML) - roundNum(taskTime));
            }

        });
        /*document.getElementById('result-filter-descr').innerHTML = '<b>' + hourTohhmm(totalTime) + '</b> (' + roundNum(totalTime) + ')';*/
        document.querySelector('.pds-stat-block-data').innerHTML = hourTohhmm(totalTime);
        document.querySelector('.pds-table tfoot tr td.pds-nowrap strong').innerHTML = roundNum(totalTime).toFixed(2);

    }
    // grab the "Group by: Task" button
    //var btnGroupBy = document.querySelector('.pds-menu-container:nth-child(2)');
    function waitForElm(selector) {
        return new Promise((resolve) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector))
            }

            const observer = new MutationObserver((mutations) => {
                if (document.querySelector(selector)) {
                    resolve(document.querySelector(selector))
                    observer.disconnect()
                }
            })

            observer.observe(document.body, {
                childList: true,
                subtree: true,
            })
        })
    }

    waitForElm('.pds-menu-container').then((btnGroupBy) => {

        if(btnGroupBy != null){
            const style = document.createElement('style');
            style.textContent = `.harvest-input{
            height:28px;
            bottom: -2px;
            position: relative;
            margin-left: 7px;
            margin-right: 7px;
            border: 1px solid #b6b6b6;
            border-radius: 6px;
            width:115px;
            padding-left:7px;
            margin-top: -4px;
            font-size: 13px;
        }
        .hidden-link{
            text-decoration:none;
            color:#222;
            transition:color .2s ease-out;
        }
        .hidden-link:hover{
            color:#007AC1;
        }
        .harvest-convert-hours{
            border-radius: 999rem;
            background: #f36c00;
            position: fixed;
            right: 16px;
            color: #fff;
            font-family: "Fakt","Helvetica Neue",arial,sans-serif;
            font-size: 15px;
            font-weight: 500;
            height: 40px;
            z-index: 300;
            bottom: 65px;
            padding: 0 15px;
        }
        .harvest-convert-hours span{
        	transition: all .2s ease-out;
        }
        .harvest-convert-hours .active{
            font-weight:bold;
            font-size: 16px;
        }
        .harvest-convert-hours svg{
            margin-top: -6px;
        }
        .spin {
          animation-name: spin;
          animation-duration: 500ms;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
        }

        @keyframes spin {
            from {
                transform:rotate(0deg);
            }
            to {
                transform:rotate(180deg);
            }
        }`;
            document.head.append(style);
            var input = document.createElement("input");
            input.type = "text";
            input.className = "harvest-input";
            input.placeholder = "description";
            input.addEventListener("keyup", function(event) {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    filterOutByDescription(input.value);
                }
            });
            var result = document.createElement("span");
            result.id = "result-filter-descr";
            btnGroupBy.parentNode.insertBefore(result, btnGroupBy.nextSibling);
            btnGroupBy.parentNode.insertBefore(input, btnGroupBy.nextSibling);

            const mainTable = document.getElementById("dtr-table");
            var regex = /(data-record-id\="(\d+)".*\n.*\n.*\n.*?)(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-](\d{4})/g;
            mainTable.innerHTML= mainTable.innerHTML.replace(regex,"$1<a class='hidden-link' target='_blank' href='/time/day/$5/$4/$3/#timesheet_day_entry_$2'>$3.$4.$5</a>");

            regex = /<th colspan="5 ">(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-](\d{4})<\/th>/g;
            mainTable.innerHTML= mainTable.innerHTML.replace(regex,"<th colspan=\"5 \"><a class='hidden-link' target='_blank' href='/time/day/$3/$2/$1/'>$1.$2.$3</a></th>");
            // gets first td, but missing date for link soo....
            //regex = /(data-record-id\="(\d+)".*\n.*\n.*\n.*?)(<td>\n(.*)\n.*<\/td>?)/g;

            // grab the "Help" button
            var askHelp = document.querySelector('body');
            var converter = document.createElement("button");
            converter.className = "harvest-convert-hours";
            converter.innerHTML = `<span class="decimals">0.25</span> &nbsp; <svg xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs" width="20" height="20" x="0" y="0" viewBox="0 0 492.883 492.883" style="enable-background:new 0 0 512 512" xml:space="preserve" class=""><g>#<g xmlns="http://www.w3.org/2000/svg">#	<g>#		<path d="M122.941,374.241c-20.1-18.1-34.6-39.8-44.1-63.1c-25.2-61.8-13.4-135.3,35.8-186l45.4,45.4c2.5,2.5,7,0.7,7.6-3    l24.8-162.3c0.4-2.7-1.9-5-4.6-4.6l-162.4,24.8c-3.7,0.6-5.5,5.1-3,7.6l45.5,45.5c-75.1,76.8-87.9,192-38.6,282    c14.8,27.1,35.3,51.9,61.4,72.7c44.4,35.3,99,52.2,153.2,51.1l10.2-66.7C207.441,421.641,159.441,407.241,122.941,374.241z" fill="#ffffff" data-original="#ffffff" class=""></path>#		<path d="M424.941,414.341c75.1-76.8,87.9-192,38.6-282c-14.8-27.1-35.3-51.9-61.4-72.7c-44.4-35.3-99-52.2-153.2-51.1l-10.2,66.7    c46.6-4,94.7,10.4,131.2,43.4c20.1,18.1,34.6,39.8,44.1,63.1c25.2,61.8,13.4,135.3-35.8,186l-45.4-45.4c-2.5-2.5-7-0.7-7.6,3    l-24.8,162.3c-0.4,2.7,1.9,5,4.6,4.6l162.4-24.8c3.7-0.6,5.4-5.1,3-7.6L424.941,414.341z" fill="#ffffff" data-original="#ffffff" class=""></path>#	</g>#</g>#<g xmlns="http://www.w3.org/2000/svg">#</g>#<g xmlns="http://www.w3.org/2000/svg">#</g>#<g xmlns="http://www.w3.org/2000/svg">#</g>#<g xmlns="http://www.w3.org/2000/svg">#</g>#<g xmlns="http://www.w3.org/2000/svg">#</g>#<g xmlns="http://www.w3.org/2000/svg">#</g>#<g xmlns="http://www.w3.org/2000/svg">#</g>#<g xmlns="http://www.w3.org/2000/svg">#</g>#<g xmlns="http://www.w3.org/2000/svg">#</g>#<g xmlns="http://www.w3.org/2000/svg">#</g>#<g xmlns="http://www.w3.org/2000/svg">#</g>#<g xmlns="http://www.w3.org/2000/svg">#</g>#<g xmlns="http://www.w3.org/2000/svg">#</g>#<g xmlns="http://www.w3.org/2000/svg">#</g>#<g xmlns="http://www.w3.org/2000/svg">#</g>#</g></svg> &nbsp; <span class="hours">0h15</span>`;
            converter.addEventListener("click", function(event) {
                var convertToHours = true;
                if(document.querySelector('.harvest-convert-hours .hours').classList.contains('active'))
                    convertToHours = false;

                document.querySelector('.harvest-convert-hours svg').classList.add("spin")

                async function asyncSearch() {
                    setTimeout(function() {
                        document.querySelector('.harvest-convert-hours svg').classList.remove("spin")
                        document.querySelector('.harvest-convert-hours span').classList.remove("active")
                        if(convertToHours){
                            document.querySelector('.harvest-convert-hours .hours').classList.add("active")
                            document.querySelector('.harvest-convert-hours .decimals').classList.remove("active")
                        }
                        else{
                            document.querySelector('.harvest-convert-hours .decimals').classList.add("active")
                            document.querySelector('.harvest-convert-hours .hours').classList.remove("active")
                        }
                    }, 500);
                }

                asyncSearch();
                setTimeout(() => {
                    var body = document.body.innerHTML
                    console.log('calling');
                    console.log([...body.matchAll(/\d+\.[\d+]{2}(?!\.)\b/g)])
                    console.log([...body.matchAll(/\d+\.[\d+]{2}(?!\.)\b/g)][0])
                    if(convertToHours){
                        var decimals = [...body.matchAll(/(<.+?>[^<>]*?)((?<!\.)\d+\.[\d+]{2}(?!\.)\b)([^<>]*?<\/.+?>)/g)];
                        decimals.forEach(decimal => {
                            console.log(decimal)
                            var regex = '(<.+?>[^<>]*?)\\b' +
                                decimal[2].replace('.','\\.') + /* literal dot, not 'any char' */
                                '\\b([^<>]*?<\/.+?>)';
                            console.log(decimal[2],regex)
                            regex = new RegExp(regex, ""); /* the g was removed because it changed the dates as well. g changes all result, without g is only the first result */
                            body = body.replace(regex, '$1'+hourTohhmm(decimal[2])+'$2');
                        });
                    }
                    else{

                        var hours = [...body.matchAll(/\b[\d+]{2}h[\d+]{2}\b/g)];
                        hours.forEach(hour => {
                            console.log(hour[0])
                            var regex = new RegExp('\\b' + hour[0] + '\\b', "g");
                            body = body.replace(regex, hhmmToHours(hour[0]));
                        });
                    }

                    document.body.innerHTML = body;
                    //document.querySelector('.harvest-convert-hours svg').classList.remove("spin")
                    //document.body.innerHTML = document.body.innerHTML.replace(/\d+\.[\d+]{2}(?!\.)\b/g, 'hi');
                }, 200);


            });
            askHelp.parentNode.insertBefore(converter, askHelp.nextSibling);


        }
    })


})();