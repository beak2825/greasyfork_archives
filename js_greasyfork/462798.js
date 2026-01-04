// ==UserScript==
// @name         Auto Steam Age Verification
// @description  Steam with amnesia always asking your age? Tell Steam once and for all how old you are and say goodbye to age verification.
// @version      1.0
// @namespace    Roxas_Alt
// @license      CC-BY-NC-SA
// @include      http://store.steampowered.com/*
// @include      https://store.steampowered.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @icon         https://store.steampowered.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/462798/Auto%20Steam%20Age%20Verification.user.js
// @updateURL https://update.greasyfork.org/scripts/462798/Auto%20Steam%20Age%20Verification.meta.js
// ==/UserScript==

////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
//    Don't trust my script? I'll explain how it works.                                                   //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
//    1. It checks if you have already saved your age in local storage. If so, it uses this data, if      //
//    not, it uses standard data and saves it in local storage.                                           //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
//    2. Each time a store.stempoWered.com finishes loading, the script performs the Timestamp ()         //
//    function. This function uses the data obtained in the first step to create a Timestamp Unix and     //
//    then create/override the Birthtime cookie.                                                          //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
//    Cookie Birthtime is used by Steam to determine your age, if this cookie does not exist Steam        //
//    asks your age and creates this cookie, if the created cookie is invalid or inform you that you      //
//    are under 18, then Steam does not let you Access the page. Cookie is stored locally and only        //
//    lasts one session.                                                                                  //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
//    The idea of this script is always to keep this cookie in your browser so that Steam no longer       //
//    asks what your age is. If Steam kept this saved cookie, you would only need to inform your age      //
//    once, but as Steam does not save (and there are reasons), this script "simulates" that.             //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
//    - That's just it, but also has the settings.                                                        //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
//    3. The configuration creates an extra element within the page. Settings use the data obtained       //
//    from step 1 to inform what the current settings are. You can save by saving the inserted values     //
//    in local storage. You can reset values to the default or simply close the settings.                 //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                        //
//    In the end, all the script does is to save locally the date you inform and always create the        //
//    cookie needed for Steam never to ask your age again.                                                //
//                                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////////////////////

const defaultConfig = {
  year: 2000,
  month: 1,
  day: 1,
  hours: 1,
  minute: 0,
  seconds: 1,
};

const storedConfig = localStorage.getItem('config');
if (storedConfig !== null) {
  const parsedConfig = JSON.parse(storedConfig);
  config = parsedConfig;
} else {
  localStorage.setItem('config', JSON.stringify(defaultConfig));
  config = defaultConfig;
}

GM_registerMenuCommand('Settings', createConfigForm);

function createConfigForm() {
  var overlay = document.createElement('div');
  overlay.setAttribute('id', 'overlay-config-form');
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  overlay.style.zIndex = '9999';
  document.body.appendChild(overlay);

  var form = document.createElement('form');
  form.setAttribute('id', 'config-form');
  form.style.position = 'fixed';
  form.style.top = '50%';
  form.style.left = '50%';
  form.style.transform = 'translate(-50%, -50%)';
  form.style.padding = '16px';
  form.style.border = '1px solid #171a27';
  form.style.borderRadius = '8px';
  form.style.backgroundColor = '#fff';
  form.style.display = 'flex';
  form.style.flexDirection = 'column';
  form.style.backgroundColor = '#171a21';
  form.style.zIndex = '99999';

  var heading = document.createElement('h1');
  heading.textContent = '⚙ Steam Age Settings';

  var text = document.createElement('p');
  text.textContent = "Please enter valid values. (You don't want an error, do you?)";

  var yearDiv = document.createElement('div');

  var yearLabel = document.createElement('label');
  yearLabel.textContent = 'Year:';
  var yearInput = document.createElement('input');
  yearInput.setAttribute('type', 'number');
  yearInput.setAttribute('name', 'year');
  yearInput.setAttribute('value', config.year);

  var monthDiv = document.createElement('div');

  var monthLabel = document.createElement('label');
  monthLabel.textContent = 'Month:';
  var monthInput = document.createElement('input');
  monthInput.setAttribute('type', 'number');
  monthInput.setAttribute('name', 'month');
  monthInput.setAttribute('value', config.month);

  var dayDiv = document.createElement('div');

  var dayLabel = document.createElement('label');
  dayLabel.textContent = 'Day:';
  var dayInput = document.createElement('input');
  dayInput.setAttribute('type', 'number');
  dayInput.setAttribute('name', 'day');
  dayInput.setAttribute('value', config.day);

  var textHour = document.createElement('p');
  textHour.textContent = "I don't recommend changing the values below.";

  var hoursDiv = document.createElement('div');

  var hoursLabel = document.createElement('label');
  hoursLabel.textContent = 'Hours:';
  var hoursInput = document.createElement('input');
  hoursInput.setAttribute('type', 'number');
  hoursInput.setAttribute('name', 'hours');
  hoursInput.setAttribute('value', config.hours);

  var minuteDiv = document.createElement('div');

  var minuteLabel = document.createElement('label');
  minuteLabel.textContent = 'Minute:';
  var minuteInput = document.createElement('input');
  minuteInput.setAttribute('type', 'number');
  minuteInput.setAttribute('name', 'minute');
  minuteInput.setAttribute('value', config.minute);

  var secondsDiv = document.createElement('div');

  var secondsLabel = document.createElement('label');
  secondsLabel.textContent = 'Seconds:';
  var secondsInput = document.createElement('input');
  secondsInput.setAttribute('type', 'number');
  secondsInput.setAttribute('name', 'seconds');
  secondsInput.setAttribute('value', config.seconds);

  var buttonsDiv = document.createElement('div');

  var saveButton = document.createElement('button');
  saveButton.textContent = 'Save';
  saveButton.setAttribute('type', 'submit');

  var resetButton = document.createElement('button');
  resetButton.textContent = 'Reset';
  resetButton.setAttribute('type', 'button');
  resetButton.addEventListener('click', function () {
    document.getElementById('config-form').remove();
    document.getElementById('overlay-config-form').remove();
    localStorage.setItem('config', JSON.stringify(defaultConfig));
    config = defaultConfig;
    console.log(config);
    var timestampUnix = timestamp(config);
    console.log(timestampUnix);
  });

  var closeButton = document.createElement('button');
  closeButton.textContent = 'Close';
  closeButton.setAttribute('type', 'button');
  closeButton.addEventListener('click', function () {
    document.getElementById('config-form').remove();
    document.getElementById('overlay-config-form').remove();
  });

  overlay.appendChild(form);

  form.appendChild(heading);
  form.appendChild(text);
  text.style.marginTop = '20px';

  form.appendChild(yearDiv);
  yearDiv.appendChild(yearLabel);
  yearDiv.appendChild(yearInput);

  yearDiv.style.marginTop = '20px';
  yearDiv.style.display = 'inline-flex';
  yearLabel.style.marginRight = '5px';
  yearLabel.style.width = '70px';
  yearInput.style.flex = '1';

  form.appendChild(monthDiv);
  monthDiv.appendChild(monthLabel);
  monthDiv.appendChild(monthInput);

  monthDiv.style.display = 'inline-flex';
  monthLabel.style.marginRight = '5px';
  monthLabel.style.width = '70px';
  monthInput.style.flex = '1';

  form.appendChild(dayDiv);
  dayDiv.appendChild(dayLabel);
  dayDiv.appendChild(dayInput);

  dayDiv.style.display = 'inline-flex';
  dayLabel.style.marginRight = '5px';
  dayLabel.style.width = '70px';
  dayInput.style.flex = '1';

  form.appendChild(textHour);
  textHour.style.marginBottom = '20px';

  form.appendChild(hoursDiv);
  hoursDiv.appendChild(hoursLabel);
  hoursDiv.appendChild(hoursInput);

  hoursDiv.style.display = 'inline-flex';
  hoursLabel.style.marginRight = '5px';
  hoursLabel.style.width = '70px';
  hoursInput.style.flex = '1';

  form.appendChild(minuteDiv);
  minuteDiv.appendChild(minuteLabel);
  minuteDiv.appendChild(minuteInput);

  minuteDiv.style.display = 'inline-flex';
  minuteLabel.style.marginRight = '5px';
  minuteLabel.style.width = '70px';
  minuteInput.style.flex = '1';

  form.appendChild(secondsDiv);
  secondsDiv.appendChild(secondsLabel);
  secondsDiv.appendChild(secondsInput);

  secondsDiv.style.display = 'inline-flex';
  secondsLabel.style.marginRight = '5px';
  secondsLabel.style.width = '70px';
  secondsInput.style.flex = '1';

  form.querySelectorAll('div').forEach(function (div) {
    div.style.marginBottom = '20px';
  });

  form.appendChild(buttonsDiv);
  buttonsDiv.appendChild(saveButton);
  buttonsDiv.appendChild(resetButton);
  buttonsDiv.appendChild(closeButton);

  // Estilo para o div dos botões
  buttonsDiv.style.display = 'flex';
  buttonsDiv.style.justifyContent = 'flex-end';

  // Estilo para os botões
  saveButton.style.padding = '8px 16px';
  saveButton.style.borderRadius = '4px';
  saveButton.style.backgroundColor = '#4CAF50';
  saveButton.style.color = '#fff';
  saveButton.style.border = '0px';

  resetButton.style.padding = '8px 16px';
  resetButton.style.borderRadius = '4px';
  resetButton.style.backgroundColor = '#2196F3';
  resetButton.style.color = '#fff';
  resetButton.style.border = '0px';
  resetButton.style.marginLeft = '10px';

  closeButton.style.padding = '8px 16px';
  closeButton.style.borderRadius = '4px';
  closeButton.style.backgroundColor = '#f44336';
  closeButton.style.color = '#fff';
  closeButton.style.border = '0px';
  closeButton.style.marginLeft = '10px';

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    saveConfig(form);
  });
}

function saveConfig(event) {
  var year = parseInt(document.querySelector('input[name="year"]').value);
  var month = parseInt(document.querySelector('input[name="month"]').value);
  var day = parseInt(document.querySelector('input[name="day"]').value);
  var hours = parseInt(document.querySelector('input[name="hours"]').value);
  var minute = parseInt(document.querySelector('input[name="minute"]').value);
  var seconds = parseInt(document.querySelector('input[name="seconds"]').value);

  document.getElementById('config-form').remove();
  document.getElementById('overlay-config-form').remove();

  localStorage.setItem(
    'config',
    JSON.stringify({
      year: year,
      month: month,
      day: day,
      hours: hours,
      minute: minute,
      seconds: seconds,
    })
  );

  config = {
    year: year,
    month: month,
    day: day,
    hours: hours,
    minute: minute,
    seconds: seconds,
  };

  console.log(config);
  var timestampUnix = timestamp(config);
  console.log(timestampUnix);
}

function timestamp(config) {
  var timestampUnix = new Date(config.year, config.month - 1, config.day, config.hours, config.minute, config.seconds).getTime() / 1000;
  document.cookie = 'birthtime=' + timestampUnix + '; Secure; path=/; Max-Age=31556926; SameSite=None';
  return timestampUnix;
}

window.addEventListener('load', function () {
  console.log(config);
  var timestampUnix = timestamp(config);
  console.log(timestampUnix);
});
