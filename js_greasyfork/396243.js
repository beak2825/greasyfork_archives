// ==UserScript==
// @name         Add Go Tournaments to Calendar
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Adds "Add to Google Calendar" links to the list of European Go tournaments list on eurogofed.org.
// @author       zigah
// @match        eurogofed.org/calendar*
// @match        www.eurogofed.org/calendar*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/396243/Add%20Go%20Tournaments%20to%20Calendar.user.js
// @updateURL https://update.greasyfork.org/scripts/396243/Add%20Go%20Tournaments%20to%20Calendar.meta.js
// ==/UserScript==

function queryParams(data) {
  return Object.keys(data).map(function(key) {
    return [key, data[key]].map(encodeURIComponent).join("=");
  }).join("&");
}

function googleCalendarUrl(data) {
  const params = {
    action: 'TEMPLATE',
    text: data.name,
    details: data.description,
    sprop: 'name:GoOut',
    dates: `${data.dateStart}/${data.dateEnd}`,
    //location: `${data.venue}, ${data.address}`,
    location: `${data.city}, ${data.country}`,
    pli: 1,
    sfi: 'true'
  }

  return `https://www.google.com/calendar/render?${queryParams(params)}`
}

function appendLink (data, parent) {
  const a = document.createElement('a');
  a.innerHTML = 'Add&nbsp;to&nbsp;Google&nbsp;Calendar'
  a.target = '_blank'
  a.title = 'Add to Google Calendar'
  a.href = googleCalendarUrl(data)

  if (parent && a.parentElement != parent) {
    parent.prepend(a)
  }
}

function addDays(date, days) {
  var result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

(function() {
    'use strict';

    [...document.querySelectorAll("table")]
        .forEach(table => {

        [...table.querySelectorAll("tr")]
            .forEach(row => {

            var eventData = {
                name: "",
                description: "",
                country: "",
                city: "",
                dateStart: "",
                dateEnd: "",
            }

            var tds = row.querySelectorAll("td");
            for (var i = 0; i < tds.length; i++)
            {
                var col = tds[i];
                var date;

                if(col.firstChild) {
                    var data = col.firstChild.data;
                    switch(i) {
                        case 0:
                            //console.log("From: "+ data);
                            if(data) {
                                date = data.split(".");
                                eventData.dateStart = date[2] + date[1] + date[0];
                            } else {
                                //console.log("From: ");
                                //console.log(col.firstChild);
                            }
                            break;
                        case 1:
                            //console.log("To: "+ data);
                            if(data) {
                                date = data.split(".");
                                var dateEnd = new Date(parseInt(date[2]), parseInt(date[1]), parseInt(date[0]));
                                var dateEndPlusOne = addDays(dateEnd, 1);
                                var yyyy = dateEndPlusOne.getFullYear().toString();
                                var mm = dateEndPlusOne.getMonth().toString();
                                if(mm.length == 1) mm = "0" + mm;
                                var dd = dateEndPlusOne.getDate().toString();
                                if(dd.length == 1) dd = "0" + dd;

                                eventData.dateEnd = yyyy + mm + dd;
                            } else {
                                //console.log("To: ");
                                //console.log(col.firstChild);
                            }
                            break;
                        case 2:
                            //console.log("Co: "+ data);
                            eventData.country = data;
                            if(!data) {
                                //console.log("City: ");
                                //console.log(col.firstChild);
                            }
                            break;
                        case 3:
                            if(col.firstChild.firstChild) {
                                if(col.firstChild.firstChild.data) {
                                    data = col.firstChild.firstChild.data;
                                } else {
                                    //console.log("City: ");
                                    //console.log(col.firstChild);
                                }
                            }
                            //console.log("City: "+ data);
                            eventData.city = data;
                            break;
                        case 4:
                            if(col.firstChild.firstChild) {
                                if(col.firstChild.firstChild.firstChild)
                                    if(col.firstChild.firstChild.firstChild.data) {
                                        data = col.firstChild.firstChild.firstChild.data;
                                    } else {
                                        //console.log("Event name: ");
                                        //console.log(col.firstChild);
                                    }
                            }
                            //console.log("Event: "+ data);
                            eventData.name = data;
                            break;
                        case 5:
                            //console.log("Contact: "+ data);
                            //console.log(col.firstChild);
                            if(!data) {
                                if(col.firstChild.firstChild) {
                                    if(col.firstChild.firstChild.data) {
                                        data = col.firstChild.firstChild.data;
                                        //console.log(col.firstChild);
                                    } else {
                                        if(col.firstChild.firstChild.firstChild)
                                        {
                                            if(col.firstChild.firstChild.firstChild.data) {
                                                data = col.firstChild.firstChild.firstChild.data;
                                            } else {
                                                //console.log("Contact: ");
                                                //console.log(col.firstChild);
                                            }
                                        }
                                    }
                                }
                            }
                            if(col.firstChild.href) {
                                //console.log(col.firstChild.href);
                                data += " - " + col.firstChild.href
                            }

                            eventData.description = data;
                            break;
                        default:
                    }
                }
            }

            var td = document.createElement("td");
            //td.innerText = " !!! ";
            row.appendChild(td);
            if(eventData.name != "") {
                appendLink(eventData, td);
            }
        }
                    );
    }
                );

            //var yearMonth1 = celldata[0].split(".");
            //var data1 = new Date(yearMonth1[0], yearMonth1[1] - 1, 1);
            //var data2 = new Date(yearMonth2[0], yearMonth2[1] - 1, 1);
            //        if (data1 <= data && data2 >= data) {
            //            alert(place);
            //        }

//    [...document.querySelectorAll("th")]
//        .forEach(a => console.log(a.textContent));

//    .filter(a => a.textContent.includes(""))
//    .forEach(a => console.log(a.textContent));
})();