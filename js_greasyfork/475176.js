// ==UserScript==
// @name         Driving Test
// @version      1.1
// @description  Get an eailer time to do your driving test
// @author       James Prince
// @match        https://www.service.transport.qld.gov.au/SBSExternal/application/SlotSelection.xhtml?*
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/439534
// @require https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.3.0/js/bootstrap-datepicker.js
// @resource https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.7.1/css/bootstrap-datepicker3.min.css
// @downloadURL https://update.greasyfork.org/scripts/475176/Driving%20Test.user.js
// @updateURL https://update.greasyfork.org/scripts/475176/Driving%20Test.meta.js
// ==/UserScript==

// SlotSelection = https://www.service.transport.qld.gov.au/SBSExternal/application/SlotSelection.xhtml?*

// Variables

var ReloadValue;
var reloadObject;
var TimeSet;
var ListofTimes;
var DateSelected;
var availableDates;
var DiscordData;
var DiscordWebhook;

var EarlierStyle;
var LaterStyle;

var UserInputForm;


// Functions

function ReloadPage() {
  location.reload();
}

String.prototype.format = function(...values) {
  var formatted = this;
  values.forEach((arg, i) => {
    formatted = formatted.replace(new RegExp('\\{' + i + '\\}', 'gi'), arg);
  });
  return formatted;
};

var getCookie = (key) => {
  var matches = [...document.cookie.matchAll(/([^= ]+)=([^; ]+);/g)].filter((CookiesJSON) => {
    if (CookiesJSON[1] == key) {
      return true
    }
  });
  return (matches.length) ? matches[0][2] : null;
};
var setCookie = (key, value) => {
  document.cookie = key + "=" + value + ";expires=Fri, 31 Dec 9999 23:59:59 GMT;path=/";
};

var selectRadio = (index) => {
  $($("#slotSelectionForm\\:slotTable_data").children()[index]).find('input')[0].click();
};
var ConfirmSelection = () => {
  (autoConfirm) ? $("#slotSelectionForm\\:actionFieldList\\:confirmButtonField\\:confirmButton").click(): pass
};

var formatSlotTime = (value) => {
  console.log(value);
  return [new Date("{1} {0}, {2} {3}:{4}".format(value[2], value[3], value[4], (value[7] == 'PM') ? parseInt(value[5]) + 12 : value[5], value[6])).getTime(), value[1]]
};

var ChangeNumbers = (num) => {
  return (num.toString().length == 1) ? "0" + num : num
};

var GetTimeAvailable = (formid) => {
  return [...$(formid)[0].innerHTML.matchAll(RegExp('([0-9]):startTime\\">[A-Za-z]+, ([0-9]{2}) ([A-Za-z]+) (202[0-9]) ([0-9]+):([0-9]+) (PM|AM)', 'g'))];
};

function Elements() {
  autoConfirm = true;

  EarlierStyle = "color: white;background: rgba(0, 128, 0, 0.5);"
  LaterStyle = "color: white;background: rgba(255, 0, 0, 0.5);"

  ReloadValue = getCookie("ATreload");
  DateSelected = new Date(parseInt(getCookie("ATdateselected")));
  if (getCookie("ATavailableDates") == null || getCookie("ATavailableDates") == "") {
      availableDates = [];
} else {
    availableDates = getCookie("ATavailableDates").split(',').map(n => {n = new Date(n *1 ); return n.getDate() + "/" + (n.getMonth() + 1) + "/" + n.getFullYear()});
    }
  UserInputForm = ' <form id="FormSettings" onsubmit="event.preventDefault()" style="text-align: center;border: gray;border-style: solid;padding: 10px;margin: 10px;">';
  UserInputForm += '  <h2>Driving Test Finder</h2>';
  UserInputForm += '  <div style="margin: 10px;">';
  UserInputForm += '    Find a Time Earlier than';
  UserInputForm += '    <input class="Changable" id="ATdate" type="date" value="{0}" required>';
  UserInputForm += '    <input class="Changable" id="ATtime" type="time" value="{1}" required>';
  UserInputForm += '  </div>';
  UserInputForm += '  <div style="margin: 10px;">';
    UserInputForm += '    Available Dates (comma-separated)';
    UserInputForm += '    <input class="Changable date" id="ATavailableDates" type="text" value="{2}" name="Dates" placeholder="Select days" >';
    UserInputForm += '  </div>';
  UserInputForm += '  <div style="margin: 10px;">';
  UserInputForm += '    Reload Every <input class="Changable" id="ATreload" min=5 type=number value={3}> Seconds';
  UserInputForm += '  </div>';
  UserInputForm += '  <div style="margin: 10px;">';
  UserInputForm += '    <input class="Changable" id="ATautoconfirm" type="checkbox" {4}> AutoConfirm Time once it has been found? ';
  UserInputForm += '  </div>';
  UserInputForm += '  <div>';
  UserInputForm += '    <button class="Changable" id="ATsave" style="background-color:lightskyblue">Save</button>';
  UserInputForm += '    <spam style="margin:25px"></spam>';
  UserInputForm += '    <button id="ATtoggle" style="background-color: #4e8200">Start</button>';
  UserInputForm += '  </div>';
  UserInputForm += '</form>';

  UserInputForm = UserInputForm.format(DateSelected.getFullYear() + '-' + ChangeNumbers(DateSelected.getMonth() + 1) + '-' + ChangeNumbers(DateSelected.getDate()), ChangeNumbers(DateSelected.getHours()) +
                                       ":" + ChangeNumbers(DateSelected.getMinutes()), availableDates.join(','), ReloadValue, (getCookie("ATconfirm") == "true") ? "Checked" : "");

  $("#j_id_57").after(UserInputForm);

  $(document).ready(function() {
    $('#ATavailableDates').datepicker({
        startDate: new Date(),
        multidate: true,
        format: "dd/mm/yyyy",
        daysOfWeekHighlighted: "5,6",
        datesDisabled: ['31/08/2017'],
        language: 'en'
    }).on('changeDate', function(e) {
        // `e` here contains the extra attributes
        //$(this).find('.input-group-addon .count').text(' ' + e.dates.length);
    });
});

  DiscordWebhook = "https://discord.com/api/webhooks/800209784170479616/3P7VZEAvlzstOtsvql9PIBCU84XnYuYZEMK5In6C_zelFq4iMxDsHF5XMrTU3EWdmSnq"
  DiscordData = {
    "content": null,
    "embeds": [{
      "title": "An earlier time has been found! @<yourusername>",
      "description": "Your new time {0} been confirmed",
      "color": null,
      "fields": [{
          "name": "Old Time",
          "value": "{1}",
          "inline": true
        },
        {
          "name": "New Time",
          "value": "{2}",
          "inline": true
        }
      ],
      "image": {
        "url": "https://i.redd.it/9huar2rzx9421.jpg"
      }
    }],
    "username": "Driving Test Scheduler",
    "avatar_url": "https://eclipsedrivingschool.com.au/wp-content/uploads/2019/05/fail-driving-test-eclipse-driving-school.jpg"
  };
  DiscordData = JSON.stringify(DiscordData);

  $("#ATtoggle").click(function() {
    (getCookie("ATrunning") == "1") ? Stop(): Start()
  });
  $("#ATsave").click(SaveValues);
}

function SaveValues() {
  setCookie("ATdateselected", new Date($("#ATdate")[0].value + " " + $("#ATtime")[0].value).getTime())
  setCookie("ATreload", $("#ATreload")[0].value)
  setCookie("ATconfirm", $("#ATautoconfirm")[0].checked)

  // Get the dates from the form input, split by comma, and map to Date objects
  if ($("#ATavailableDates")[0].value == "NaN/NaN/NaN" || $("#ATavailableDates")[0].value == ""){
    setCookie("ATavailableDates", "");
    return;
  }
  var availableDates = $("#ATavailableDates")[0].value.split(',').map(s => {
    let [d, m, y] = s.split(/\D/);
    return new Date(y, m-1, d).getTime();
  });

  // Save the array of dates to a cookie as a JSON string
  setCookie("ATavailableDates", availableDates.join(','));
}

var Notify = (OldDate, NewDate) => {
  new Notification("New Time has been Found!", {
      body: "You new time has been Found!\n Old Time: "+new Date(OldDate).toLocaleString()+"\n New Time: "+new Date(NewDate).toLocaleString(),
      icon: "https://eclipsedrivingschool.com.au/wp-content/uploads/2019/05/fail-driving-test-eclipse-driving-school.jpg"
  });
  fetch(DiscordWebhook, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-cache',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
    body: DiscordData.format((autoConfirm) ? "has" : "hasn't", new Date(OldDate).toLocaleString(), new Date(NewDate).toLocaleString())
  });
}
window.Not = Notify;

// Function to format and compare time
function formatAndCompareTime(time) {
    time = formatSlotTime(time);
    // if the ATavailableDates is empty and the time is earlier than ATdateselected
    if (getCookie("ATdateselected") > time[0] &&( getCookie("ATavailableDates") == "" || getCookie("ATavailableDates") == null)) {
        return true;
    }
    var ishere= false;
  // for each date in ATavailableDates, if date is the time date
  getCookie("ATavailableDates").split(',').map(n => new Date(n * 1)).forEach((date) => {
    if (date.getDate() == new Date(time[0]).getDate() && date.getMonth() == new Date(time[0]).getMonth() && date.getFullYear() == new Date(time[0]).getFullYear()) {

        ishere = true;
        return;
    }
  });
  return ishere;
}

// Function to check time
function CheckTime(time) {
  if (formatAndCompareTime(time)) {
    Stop();
    Notify(parseInt(getCookie("ATdateselected")), time[0])
    $("#slotSelectionForm\\:slotTable_data").children()[time[1]].style = EarlierStyle
    if (getCookie("ATconfirm") == "true") {
        selectRadio(time[1]);
        ConfirmSelection();
    }
  } else {
    $("#slotSelectionForm\\:slotTable_data").children()[time[1]].style = LaterStyle;
  }
}

var Start = () => {
    if (getCookie("ATreload") >= 5){
        $("#ATtoggle")[0].style = "background-color: #dc3545;";
        $("#ATtoggle")[0].textContent = "Stop";
        $(".Changable").each(function() {
            $(this).attr('disabled', 'disabled')
        });
        reloadObject = setInterval(ReloadPage, getCookie("ATreload") * 1000);
        setCookie("ATrunning", 1)
    }
};

var Stop = () => {
  clearInterval(reloadObject);
  $(".Changable").each(function() {
    $(this).removeAttr('disabled');
  });
  setCookie("ATrunning", 0);
  $("#ATtoggle")[0].style = "background-color: #4e8200;";
  $("#ATtoggle")[0].textContent = "Start";
};

// Main Init
(function() {
  'use strict';
  if (Notification.permission == "default"){
      Notification.requestPermission();
  }
  Elements();
  GetTimeAvailable("#slotSelectionForm\\:slotTable_data").forEach(CheckTime);
  if (getCookie("ATrunning") == "1") {
    Start();
  }
})();