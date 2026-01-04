// ==UserScript==
// @name         HE IP Checker
// @namespace    HEIPChecker
// @version      1.2.1
// @description  HE IP Checker is a little userscript that checks IP addresses for their types and if they exist. It injects into the breadcrumb bar, and the input window opens when you click the link the 'Check IP's' link just beneath where your bank money is shown.
// @author       Jasper van Merle
// @match        https://legacy.hackerexperience.com/*
// @match        https://en.hackerexperience.com/*
// @match        https://br.hackerexperience.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369457/HE%20IP%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/369457/HE%20IP%20Checker.meta.js
// ==/UserScript==

const ISP_IP = '21.70.29.160';

const modal = `
  <div class="fade modal" id="input-modal" tabindex="-1" style="transition: all 1s;">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h4 class="modal-title">
            HE IP Checker by <a href="https://legacy.hackerexperience.com/profile?id=510033" target="_blank">Jasperr</a>
          </h4>
        </div>

        <form id="input-form">
          <div class="modal-body">
            <div class="row-fluid">
              <div class="span6">
                <label for="ip-input" style="font-weight: bold;">Logs / IP's</label>
                <textarea id="ip-input" class="form-control" style="width: calc(100% - 15px);" rows="10"></textarea>
              </div>
              <div class="span6">
                <label for="ignored-input" style="font-weight: bold;">Ignored IP's</label>
                <textarea id="ignored-input" class="form-control" style="width: calc(100% - 15px);" rows="10"></textarea>
              </div>
            </div>

            <div id="results">
              <div class="row-fluid">
                <div class="span3">
                  <label style="font-weight: bold;">Information</label>
                  <b>Progress: </b><span id="amount-checked">0</span> / <span id="amount-total">0</span>
                  <br>
                  <b>Non-existing IP's: </b><span id="amount-non-existing">0</span>
                  <br>
                  <b>Failed checks: </b><span id="amount-failed">0</span>
                  <br>
                  <p>Failed checks are logged to the browser console (F12 > Console).</p>
                </div>
                <div class="span3">
                  <label for="npc-input" style="font-weight: bold;">NPC's (<span id="npc-input-amount">0</span>)</label>
                  <textarea id="npc-input" class="form-control" style="width: 95%;" rows="5"></textarea>
                </div>
                <div class="span3">
                  <label for="vpc-input" style="font-weight: bold;">VPC's (<span id="vpc-input-amount">0</span>)</label>
                  <textarea id="vpc-input" class="form-control" style="width: 95%;" rows="5"></textarea>
                </div>
                <div class="span3">
                  <label for="clan-input" style="font-weight: bold;">Clan Servers (<span id="clan-input-amount">0</span>)</label>
                  <textarea id="clan-input" class="form-control" style="width: 95%;" rows="5"></textarea>
                </div>
              </div>
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn btn-default" data-dismiss="modal" type="button">Close</button>
            <button class="btn btn-primary" id="submit-button" type="submit">Check my IP's</button>
          </div>
        </form>
      </div>
    </div>
  </div>
`;

const modalLink = `
  <span class="pull-right hide-phone">
    <a href="javascript:void(0)" id="ip-check-link">Check IP's</a>
  </span>
`;

let npcServers = [];
let vpcServers = [];
let clanServers = [];
let nonExisting = [];
let erroring = [];
let isChecking = false;
let isCancelling = false;

function notify(message) {
  const doNotify = () =>
    $.gritter.add({
      title: 'HE IP Checker',
      text: message,
      image: '',
      sticky: false
    });

  if ($.gritter) {
    doNotify();
  } else {
    $('<link rel="stylesheet" type="text/css" href="css/jquery.gritter.css">').appendTo('head');
    $.getScript('js/jquery.gritter.min.js', () => doNotify());
  }
}

function getParameterByName(name) {
  name = name.replace(/[\[\]]/g, '\\$&');

  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(window.location.href);

  if (!results) return null;
  if (!results[2]) return '';

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function getCurrentIP() {
  return getParameterByName('ip') || '1.2.3.4';
}

function formatNumber(n) {
  return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function getIPsFromString(str) {
  const regex = /(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/g;
  return str.match(regex) || [];
}

function getIPsToCheck() {
  const toCheck = getIPsFromString($('#ip-input').val());
  const ignored = getIPsFromString($('#ignored-input').val());
  const nonIgnored = toCheck.filter(x => !ignored.includes(x));
  return [...new Set(nonIgnored)];
}

function executePromises(funcs) {
  return funcs.reduce((promise, func) => {
    return promise.then(x => func().then(Array.prototype.concat.bind(x)));
  }, Promise.resolve([]));
}

function visitIP(ip) {
  return fetch(`${window.location.origin}/internet?ip=${ip}`, {
    credentials: 'include',
  }).then(data => data.text());
}

function checkIP(ip) {
  return new Promise(resolve => {
    if (isCancelling) {
      resolve();
    } else {
      visitIP(ip)
        .then(data => {
          if ($('a[href="logout"]', data).length === 0) {
            return Promise.reject(new Error('You\'re not logged in!'));
          } else if ($('.widget-content:contains("404")', data).length > 0) {
            nonExisting.push(ip);
          } else {
            switch ($('.label.pull-right', data).text()) {
              case 'NPC':
                npcServers.push(ip);
                break;
              case 'VPC':
                vpcServers.push(ip);
                break;
              case 'Clan Server':
                clanServers.push(ip);
                break;
              default:
                npcServers.push(ip);
            }
          }
        })
        .catch(err => {
          console.log(`Couldn't check ${ip}. Reason:`);
          console.error(err);
          erroring.push(ip);
        })
        .then(() => {
          updateResults();
          resolve();
        });
    }
  });
}

function updateResults() {
  $('#npc-input').val(npcServers.join('\n'));
  $('#npc-input-amount').text(formatNumber(npcServers.length));
  $('#vpc-input').val(vpcServers.join('\n'));
  $('#vpc-input-amount').text(formatNumber(vpcServers.length));
  $('#clan-input').val(clanServers.join('\n'));
  $('#clan-input-amount').text(formatNumber(clanServers.length));

  $('#results textarea').each(function () {
    $(this).scrollTop($(this)[0].scrollHeight);
  });

  $('#amount-checked').text(formatNumber(npcServers.length + vpcServers.length + clanServers.length + nonExisting.length + erroring.length));
  $('#amount-failed').text(formatNumber(erroring.length));
  $('#amount-non-existing').text(formatNumber(nonExisting.length));
}

function startChecking() {
  isChecking = true;

  const ips = getIPsToCheck();

  if (ips.length === 0) {
    notify('There are no IP\'s to check.');
    isChecking = false;
    return;
  }

  const promises = ips.map(ip => () => checkIP(ip));

  npcServers = [];
  vpcServers = [];
  clanServers = [];
  nonExisting = [];
  erroring = [];
  updateResults();
  $('#amount-total').text(formatNumber(ips.length));

  $('#submit-button').text('Cancel').addClass('btn-danger').removeClass('btn-primary');
  $('[data-dismiss=modal]').attr('disabled', true);

  const start = () =>
    executePromises(promises).then(() => {
      visitIP(getCurrentIP()).catch(() => {}).then(() => {
        $('#submit-button').text('Check my IP\'s').addClass('btn-primary').removeClass('btn-danger');
        $('[data-dismiss=modal]').attr('disabled', false);

        isChecking = false;
        isCancelling = false;
      });
    });

  if ($('#results').css('display') === 'none') {
    $('#input-modal').css('width', '75%').css('left', '12.5%').css('margin-left', 0);
    setTimeout(() => $('#results').slideDown(1000), 1000);
    setTimeout(() => start(), 2000);
  } else {
    start();
  }
}

$(document).ready(() => {
  if ($('a[href="logout"]').length > 0) {
    const interval = setInterval(() => {
      if ($('.header-ip-show').text().trim().length > 0) {
        clearInterval(interval);

        $('body').append(modal);
        $('#breadcrumb').append(modalLink);

        $('#input-form').on('submit', e => {
          e.preventDefault();

          if (isChecking) {
            isCancelling = true;
          } else {
            startChecking();
          }
        });

        $('#ip-check-link').on('click', () => {
          $('#input-modal').modal('show');
          $('.modal-backdrop').removeClass('modal-backdrop');
        });

        $('#input-modal').on('shown.bs.modal', () => {
          $('#ip-input').focus();
        });

        $('#ignored-input').val(`
${ISP_IP} - ISP
${$('.header-ip-show').text()} - You
    `.trim());

        $('#results').hide();
      }
    }, 100);
  }
});
