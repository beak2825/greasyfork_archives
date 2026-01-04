// ==UserScript==
// @name         Mturk Hourly
// @namespace    https://greasyfork.org/users/11205
// @version      2.2.0
// @description  Record time spent working on HITs.  Forked from [MTurk Worker] Dashboard Enhancer v2.1.3 by @Kadauchi.
// @author       Kerek
// @include      https://worker.mturk.com/dashboard*
// @include https://worker.mturk.com/projects/*/tasks/*assignment_id=*
// @include https://worker.mturk.com/status_details/*
//@grant GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/31108/Mturk%20Hourly.user.js
// @updateURL https://update.greasyfork.org/scripts/31108/Mturk%20Hourly.meta.js
// ==/UserScript==

if (location.href.indexOf(`https://worker.mturk.com/dashboard`) !== -1) {
    Remove_Old_Data();

const toNum = (string) => Number(string.replace(/[^0-9.]/g, ``));
const toDate = (string) => string.split(`T`)[0];
const toMoney = (number) => `$${number.toFixed(2)}`;
const needPlus = (number) => number > 0 ? `+` : ``;

const statusDetailsTable = document.querySelector(
  `div[data-react-class="require('reactComponents/dailyWorkerStatisticsTable/DailyWorkerStatisticsTable')['default']"]`,
);
const statusDetailsArr = JSON.parse(statusDetailsTable.dataset.reactProps).bodyData;
const statusDetailsObj = statusDetailsArr.reduce((obj, details) => ({ ...obj, [toDate(details.date)]: details }), {});

const hitsOverviewTable = document.getElementById(`dashboard-hits-overview`);
const hitsOverviewRows = hitsOverviewTable.querySelectorAll(`.col-xs-5.text-xs-right`);
const hitsOverview = {
  approved: toNum(hitsOverviewRows[0].textContent),
  pending: toNum(hitsOverviewRows[1].textContent),
  rejected: toNum(hitsOverviewRows[2].textContent),
};

function allApprovedRate() {
  const row = document.createElement(`div`);
  row.className = `row m-b-sm`;

  const col1 = document.createElement(`div`);
  col1.className = `col-xs-7`;
  row.appendChild(col1);

  const strong = document.createElement(`strong`);
  strong.textContent = `All Approved Rate`;
  col1.appendChild(strong);

  const col2 = document.createElement(`div`);
  col2.className = `col-xs-5 text-xs-right`;
  col2.textContent = `${(
    ((hitsOverview.approved + hitsOverview.pending) /
     (hitsOverview.approved + hitsOverview.pending + hitsOverview.rejected)) *
    100
  ).toFixed(4)}%`;
  row.appendChild(col2);

  const hr = document.getElementById(`dashboard-hits-overview`).getElementsByTagName(`hr`)[1];
  hr.parentNode.insertBefore(row, hr);
}

function allRejectedRate() {
  const row = document.createElement(`div`);
  row.className = `row m-b-sm`;

  const col1 = document.createElement(`div`);
  col1.className = `col-xs-7`;
  row.appendChild(col1);

  const strong = document.createElement(`strong`);
  strong.textContent = `All Rejected Rate`;
  col1.appendChild(strong);

  const col2 = document.createElement(`div`);
  col2.textContent = `${(
    (hitsOverview.approved / (hitsOverview.approved + hitsOverview.rejected + hitsOverview.pending)) *
    100
  ).toFixed(4)}%`;
  col2.className = `col-xs-5 text-xs-right`;
  row.appendChild(col2);

  const hr = document.getElementById(`dashboard-hits-overview`).getElementsByTagName(`hr`)[1];
  hr.parentNode.insertBefore(row, hr);
}

function fourDigitPercents() {
  for (const row of document.getElementById(`dashboard-hits-overview`).getElementsByClassName(`row`)) {
    if (row.textContent.includes(`Approval Rate`)) {
      row.getElementsByClassName(`text-xs-right`)[0].textContent = `${(
        (hitsOverview.approved / (hitsOverview.approved + hitsOverview.rejected)) *
        100
      ).toFixed(4)}%`;
    }
    if (row.textContent.includes(`Rejection Rate`)) {
      row.getElementsByClassName(`text-xs-right`)[0].textContent = `${(
        (hitsOverview.rejected / (hitsOverview.approved + hitsOverview.rejected)) *
        100
      ).toFixed(4)}%`;
    }
  }
}

function hitStatusChanges() {
  const old = localStorage.getItem(`statusDetailsObj`) ? JSON.parse(localStorage.getItem(`statusDetailsObj`)) : {};
  localStorage.setItem(`statusDetailsObj`, JSON.stringify(statusDetailsObj));

  function applyChanges(node) {
    node.querySelectorAll(`.desktop-row`).forEach((row) => {
      const date = row.querySelector(`a`).href.split(`/status_details/`)[1];

      row.querySelectorAll(`.text-xs-right`).forEach((col) => {
        const key = col.classList[2].replace(`-column`, ``).replace(`-`, `_`);
        const change = statusDetailsObj[date][key] - (old[date] ? old[date][key] : 0);

        if (change !== 0) {
          const span = document.createElement(`span`);
          span.textContent = key.includes(`rewards`) || key.includes(`earnings`) ? `${needPlus(change)}${toMoney(change)}` : `${needPlus(change)}${change}`;
          span.style.float = `left`;
          span.style.fontSize = `70%`;
          col.appendChild(span);
        }
      });
    });
  }

  const observer = new MutationObserver((mutationsList, observer) => {
    mutationsList.forEach((mutation) => {
      const addedNode = mutation.addedNodes[0];

      if (addedNode && addedNode.classList.contains(`expanded-row`)) {
        applyChanges(addedNode);
      }
    });
  });

  observer.observe(statusDetailsTable, { childList: true, subtree: true });
}

function latestActivity() {
  const latest = statusDetailsArr[0];
  const date = toDate(latest.date);

  const container = document.createElement(`div`);
  container.className = `row m-b-xl`;

  const col = document.createElement(`div`);
  col.className = `col-xs-12`;
  container.appendChild(col);

  const h2 = document.createElement(`h2`);
  h2.className = `m-b-md`;
  h2.textContent = `Activity for ${date}`;
  col.appendChild(h2);

  const row = document.createElement(`div`);
  row.className = `row`;
  col.appendChild(row);

  const col2 = document.createElement(`div`);
  col2.className = `col-xs-12`;
  row.appendChild(col2);

  const border = document.createElement(`div`);
  border.className = `border-gray-lightest p-a-sm`;
  col2.appendChild(border);

  const earningsRow = document.createElement(`div`);
  earningsRow.className = `row m-b-sm`;
  border.appendChild(earningsRow);

  const earningsText = document.createElement(`div`);
  earningsText.className = `col-xs-7 col-sm-6 col-lg-7`;
  earningsRow.appendChild(earningsText);

  const earningsStrong = document.createElement(`strong`);
  earningsStrong.textContent = `Projected Earnings`;
  earningsText.appendChild(earningsStrong);

  const earningsValue = document.createElement(`div`);
  earningsValue.className = `col-xs-5 col-sm-6 col-lg-5 text-xs-right`;
  earningsValue.textContent = localStorage.todaysearnings || `$0.00`;
  earningsRow.appendChild(earningsValue);

    const hourlyRow = document.createElement(`div`);
    hourlyRow.className = `row m-b-sm`;
    border.appendChild(hourlyRow);

    const hourlyText = document.createElement(`div`);
    hourlyText.className = `col-xs-6 col-sm-6 col-lg-6`;
    hourlyRow.appendChild(hourlyText);

    const hourlyStrong = document.createElement(`strong`);
    hourlyStrong.textContent = `Total Hourly`;
    hourlyText.appendChild(hourlyStrong);

    const hourlyTime = document.createElement(`div`);
    hourlyTime.className = `col-xs-3 col-sm-3 col-lg-3 text-xs-right`;
    hourlyTime.textContent = `00:00:00`;
    hourlyRow.appendChild(hourlyTime);

    const hourlyValue = document.createElement(`div`);
    hourlyValue.className = `col-xs-3 col-sm-3 col-lg-3 text-xs-right`;
    hourlyValue.textContent = `$0.00`;
    hourlyRow.appendChild(hourlyValue);


  const bonusesRow = document.createElement(`div`);
  bonusesRow.className = `row m-b-sm`;
  border.appendChild(bonusesRow);

  const bonusesText = document.createElement(`div`);
  bonusesText.className = `col-xs-7 col-sm-6 col-lg-7`;
  bonusesRow.appendChild(bonusesText);

  const bonusesStrong = document.createElement(`strong`);
  bonusesStrong.textContent = `Bonuses`;
  bonusesText.appendChild(bonusesStrong);

  const bonusesValue = document.createElement(`div`);
  bonusesValue.className = `col-xs-5 col-sm-6 col-lg-5 text-xs-right`;
  bonusesValue.textContent = localStorage.todaysbonuses || `$0.00`;
  bonusesRow.appendChild(bonusesValue);

  const collapse = document.createElement(`div`);
  collapse.id = `TodaysActivityAdditionalInfo`;
  collapse.className = `collapse`;
  border.appendChild(collapse);

  const hr = document.createElement(`hr`);
  hr.className = `m-b-sm m-t-0`;
  collapse.appendChild(hr);

  const hr2 = document.createElement(`hr`);
  hr2.className = `m-b-sm m-t-0`;
  border.appendChild(hr2);

  const control = document.createElement(`a`);
  control.className = `collapse-more-less`;
  control.href = `#TodaysActivityAdditionalInfo`;
  control.setAttribute(`aria-controls`, `TodaysActivityAdditionalInfo`);
  control.setAttribute(`aria-expanded`, `false`);
  control.setAttribute(`data-toggle`, `collapse`);
  border.appendChild(control);

  const more = document.createElement(`span`);
  more.className = `more`;
  control.appendChild(more);

  const plus = document.createElement(`i`);
  plus.className = `fa fa-plus-circle`;
  more.appendChild(plus);

  const moreText = document.createTextNode(`\nMore\n`);
  more.appendChild(moreText);

  const less = document.createElement(`span`);
  less.className = `less`;
  control.appendChild(less);

  const minus = document.createElement(`i`);
  minus.className = `fa fa-minus-circle`;
  less.appendChild(minus);

  const lessText = document.createTextNode(`\nLess\n`);
  less.appendChild(lessText);

  const side = document.querySelector(`.col-md-push-8`);
  side.insertBefore(container, side.firstChild);

  bonusesValue.textContent = `$${latest.bonus_rewards.toLocaleString(`en-US`, { minimumFractionDigits: 2 })}`;

  let hitLog =
      date === localStorage.WMTD_date ? (localStorage.WMTD_hitLog ? JSON.parse(localStorage.WMTD_hitLog) : {}) : {};

  async function get(page, rescan) {
    try {
      page = Number.isInteger(page) ? page : 1;

      earningsValue.textContent = `Calculating Page ${page}`;

      const fetchURL = new URL(`https://worker.mturk.com/status_details/${date}`);
      fetchURL.searchParams.append(`page_number`, page);
      fetchURL.searchParams.append(`format`, `json`);

      const response = await fetch(fetchURL, {
        credentials: `include`,
      });

      if (response.status === 429) {
        return setTimeout(get, 2000, page, rescan);
      }

      const json = await response.json();

      for (const hit of json.results) {
        hitLog[hit.hit_id] = hit;
      }

      const logLength = Object.keys(hitLog).length;
      const expectedLength = Number(page) * 20 - 20 + json.num_results;

      if (!rescan && logLength !== expectedLength) {
        return get(1, true);
      } else {
        localStorage.WMTD_hitLog = JSON.stringify(hitLog);
      }

      localStorage.WMTD_lastPage = page;

      if (json.results.length === 20) {
        return get(++page, rescan);
      } else if (logLength !== json.total_num_results) {
        hitLog = {};
        return get(1, true);
      } else {
        let projectedEarnings = 0;
        const reqLog = {};
        const hourlyLog = {};

        for (const key in hitLog) {
          const hit = hitLog[key];

          if (hit.status !== `Rejected`) {
            projectedEarnings += hit.reward.amount_in_dollars;
          }
          if (!reqLog[hit.requester_id]) {
            reqLog[hit.requester_id] = {
              requester_id: hit.requester_id,
              requester_name: hit.requester_name,
              reward: hit.reward.amount_in_dollars,
              submitted: 1,
            };
          }
            else {
            reqLog[hit.requester_id].submitted += 1;
            reqLog[hit.requester_id].reward += hit.reward.amount_in_dollars;
          }
            if (!hourlyLog[hitLog[key].requester_id]){
                                var time_data = localStorage.getItem('time_data.' + hitLog[key].hit_id.split('&')[0]);

                                if (time_data !== null){

                                    var starts = time_data.split("$#$")[3].split('?');
                                    var last_start = starts[starts.length-1];
                                    var stops = time_data.split("$#$")[4].split('?');
                                    var last_stop = stops[stops.length-1];
                                    if (last_start.length && last_stop.length){
                                        hourlyLog[hitLog[key].requester_id] = {
                                            req : hitLog[key].requester_name,
                                            intervals :[[last_start,last_stop]],
                                            totalReward : parseFloat(time_data.split("$#$")[2]),
                                        };
                                    }
                                }
                            }
                            else{
                                var time_data = localStorage.getItem('time_data.' + hitLog[key].hit_id.split('&')[0]);
                                if (time_data !== null){
                                    var starts = time_data.split("$#$")[3].split('?');
                                    var last_start = starts[starts.length-1];
                                    var stops = time_data.split("$#$")[4].split('?');
                                    var last_stop = stops[stops.length-1];
                                    if (last_start.length && last_stop.length){
                                        hourlyLog[hitLog[key].requester_id].intervals.push([last_start,last_stop]);
                                    }
                                    hourlyLog[hitLog[key].requester_id].totalReward += parseFloat(time_data.split("$#$")[2]);
                                }
                            }
        }

        const sort = Object.keys(reqLog).sort((a, b) => reqLog[a].reward - reqLog[b].reward);

        const fragment = document.createDocumentFragment();
                              var total_intervals = [];
                        var total_recorded_earnings = 0;
                        for (var j = sort.length-1; j > -1; j--){
                            var dkey = sort[j];
                            var d_req = reqLog[dkey].requester_name;
                            var d_submitted = reqLog[dkey].submitted;
                            var d_reward = Number(reqLog[dkey].reward).toFixed(2);
                            var d_hourly = "N/A";
                            if (d_req !== "Bonuses" && hourlyLog[reqLog[dkey].requester_id]){
                                var intervals = hourlyLog[reqLog[dkey].requester_id].intervals;
                                var d_intervals_sum = 0;
                                for (i=0;i<intervals.length;i++){
                                    d_intervals_sum += (intervals[i][1]-intervals[i][0]);
                                }
                                var d_intervals_avg = d_intervals_sum / intervals.length;
                                var d_intervals = mergeIntervals(intervals);
                                d_intervals = combineIntervals(intervals,Math.max(2*60*1000,Math.min(10*d_intervals_avg,10*60*1000)));
                                total_intervals = total_intervals.concat(d_intervals);
                                total_recorded_earnings += hourlyLog[reqLog[dkey].requester_id].totalReward;
                                var d_time = 0;
                                for (i=0;i<d_intervals.length; i++){
                                    var s = new Date(parseInt(d_intervals[i][0]));
                                    var f = new Date(parseInt(d_intervals[i][1]));
                                    //console.log(d_req, i, s.toLocaleTimeString(),f.toLocaleTimeString());
                                    d_time += (d_intervals[i][1] - d_intervals[i][0])/(1000*60*60);
                                }
                                d_hourly = "$" + (hourlyLog[reqLog[dkey].requester_id].totalReward / d_time).toFixed(2);
                            }
                            reqLog[dkey].hourly = d_hourly;
                        }
                        total_intervals = mergeIntervals(total_intervals);
                        var total_time = 0;
                        for (i=0;i<total_intervals.length; i++){
                            var s = new Date(parseInt(total_intervals[i][0]));
                            var f = new Date(parseInt(total_intervals[i][1]));
                            //console.log(i, s.toLocaleTimeString(),f.toLocaleTimeString());
                            total_time += (total_intervals[i][1] - total_intervals[i][0])/(1000*60*60);
                        }

                        var total_hourly = '$' + (total_recorded_earnings/total_time).toFixed(2);
                        var hour = Math.floor(total_time);
                        var min = Math.floor((total_time - hour)*60);
                        var sec = Math.floor((total_time - hour - min/60)*3600);
                        var time_display = (hour>0?pad(hour,2) + ":":"") + pad(min,2) + ":" + pad(sec,2);

                        hourlyValue.textContent = total_hourly;
                        hourlyTime.textContent = time_display;


        for (let i = sort.length - 1; i > -1; i--) {
          const key = sort[i];
          const requester_name = reqLog[key].requester_name;
          const reward = `$${reqLog[key].reward.toLocaleString(`en-US`, { minimumFractionDigits: 2 })}`;
          const submitted = reqLog[key].submitted;
            const hourly = reqLog[key].hourly;

          const reqRow = document.createElement(`div`);
          reqRow.className = `row m-b-sm`;
          fragment.appendChild(reqRow);

          const requester = document.createElement(`div`);
          requester.className = `col-xs-4`;
          reqRow.appendChild(requester);

          const requesterStrong = document.createElement(`strong`);
          requesterStrong.textContent = requester_name;
          requester.appendChild(requesterStrong);

          const submitValue = document.createElement(`div`);
          submitValue.className = `col-xs-2 text-xs-right`;
          submitValue.textContent = submitted;
          reqRow.appendChild(submitValue);

          const rewardValue = document.createElement(`div`);
          rewardValue.className = `col-xs-3 text-xs-right`;
          rewardValue.textContent = reward;
          reqRow.appendChild(rewardValue);


                            const hourlyValue = document.createElement(`div`);
                            hourlyValue.className = `col-xs-3 text-xs-right`;
                            hourlyValue.textContent = hourly;
                            reqRow.appendChild(hourlyValue);
        }

        collapse.appendChild(fragment);

        earningsValue.textContent = `$${projectedEarnings.toLocaleString(`en-US`, { minimumFractionDigits: 2 })}`;
      }
    } catch (error) {
      earningsValue.textContent = error;
    }
  }

  get(
    date === localStorage.WMTD_date ? (localStorage.WMTD_lastPage ? Number(localStorage.WMTD_lastPage) : 1) : 1,
    false,
  );
  localStorage.WMTD_date = date;
}


function openFirstWeek() {
  statusDetailsTable.querySelector(`.fa.expand-button.fa-plus-circle`).click();
}

function rejectionsBelow99() {
  const row = document.createElement(`div`);
  row.className = `row m-b-sm`;

  const col1 = document.createElement(`div`);
  col1.className = `col-xs-7`;
  row.appendChild(col1);

  const strong = document.createElement(`strong`);
  strong.textContent = `Rejections ≤ 99%`;
  col1.appendChild(strong);

  const col2 = document.createElement(`div`);
  col2.textContent = Math.round(
    (hitsOverview.rejected - 0.01 * (hitsOverview.approved + hitsOverview.rejected + hitsOverview.pending)) / -0.99,
  ).toLocaleString();
  col2.className = `col-xs-5 text-xs-right`;
  row.appendChild(col2);

  const additional = document
  .getElementById(`dashboard-hits-overview`)
  .getElementsByClassName(`border-gray-lightest`)[0];
  additional.appendChild(row);
}

function rejectionsBelow95() {
  const row = document.createElement(`div`);
  row.className = `row m-b-sm`;

  const col1 = document.createElement(`div`);
  col1.className = `col-xs-7`;
  row.appendChild(col1);

  const strong = document.createElement(`strong`);
  strong.textContent = `Rejections ≤ 95%`;
  col1.appendChild(strong);

  const col2 = document.createElement(`div`);
  col2.textContent = Math.round(
    (hitsOverview.rejected - 0.05 * (hitsOverview.approved + hitsOverview.rejected + hitsOverview.pending)) / -0.95,
  ).toLocaleString();
  col2.className = `col-xs-5 text-xs-right`;
  row.appendChild(col2);

  const additional = document
  .getElementById(`dashboard-hits-overview`)
  .getElementsByClassName(`border-gray-lightest`)[0];
  additional.appendChild(row);
}


allApprovedRate();
allRejectedRate();
fourDigitPercents();
hitStatusChanges();
latestActivity();
openFirstWeek();
rejectionsBelow99();
rejectionsBelow95();
}
else if (location.href.indexOf('worker.mturk.com/status_details') > -1){
$('span.reward-column:eq(0)').before('<span class="hourly-column text-xs-right column-header p-x-sm" data-reactid=".2.$header.$2">Hourly</span>');
    $('li.table-row').each(function(){
        var hitId = $(this).find('a[href*="contact_requester"]:eq(0)').attr('href').split('hit_id=')[1].split('&')[0];
                        var feedback = {opened:"N/A",submitted:"N/A", time:"N/A", hourly:"N/A"};

                        var time_data = localStorage.getItem('time_data.' + hitId);
                        if (time_data){
                    feedback = create_feedback(time_data);

                }
$(this).find('.reward-column').before('<span class="p-x-sm column hourly-column text-xs-right"><span class="hourlyCopy" title="Opened: ' + feedback.opened +'&#013;Submitted: ' + feedback.submitted +'&#013;Time: ' + feedback.time +'&#013;Hourly: ' + feedback.hourly +'">' + feedback.hourly+ '</span></span>');


    });

    $('.hourlyCopy').click(function(evt){
        evt.preventDefault();
        //GM_setClipboard($(this).attr('title'));

        GM_setClipboard('Time:' + $(this).attr('title').split('Time:')[1]);
    });
}
else if (location.href.indexOf('worker.mturk.com') > -1){
    var hit_returned = false;
    if(typeof(Storage)!=="undefined")
    {
        $('button:contains("Return")').click(function(){
            hit_returned = true;
        });
        store_data('openWorker');
        window.addEventListener('beforeunload', function(){
            store_data('closeWorker');
        });
    }
}

function create_feedback(time_data)
{

    var last_start = time_data.split("$#$")[3].split('?');
    last_start = new Date(parseInt(last_start[last_start.length - 1]));
    var last_finish = time_data.split("$#$")[4].split('?');
    last_finish = new Date(parseInt(last_finish[last_finish.length - 1]));

    //console.log(time_data, last_start, last_finish, time_data.split("$#$")[3].split('?'), time_data.split("$#$")[4].split('?'));
    var reward = time_data.split("$#$")[2];
    var time_spent = last_finish - last_start;
    var h = Math.floor(time_spent/(1000*60*60));
    var m = Math.floor((time_spent - h*1000*60*60)/(1000*60));
    var s = Math.floor((time_spent - h*1000*60*60 - m*1000*60)/(1000));
    var f = {opened:last_start.toLocaleTimeString(), submitted:last_finish.toLocaleTimeString(), time: ((h > 0 ? (pad(h,2) + ":"):"") + pad(m,2) + ":" + pad(s,2)), hourly: '$' + (reward/((last_finish-last_start)/(60*60*1000))).toFixed(2)};
    console.log(f);
    return f;
 //   return "Opened: " + last_start.toLocaleTimeString() + "<br>Submitted: " + last_finish.toLocaleTimeString()+ "<br>Time: " + (h > 0 ? (pad(h,2) + ":"):"") + pad(m,2) + ":" + pad(s,2) + "<br>Hourly: $" + (reward/((last_finish-last_start)/(60*60*1000))).toFixed(2) ;
}

function store_data(action_type)
{
        if (!hit_returned){
            var now_in_milliseconds = new Date().getTime();
            var hitReview_hitId = window.location.href.split('tasks/')[1].split('?')[0];
            console.log(action_type);

            var $data_holder = $('a:contains("HIT Details"):eq(0)').parent().attr('data-react-props');
            var requester_name = JSON.parse($data_holder).modalOptions.requesterName;
            var hit_title = JSON.parse($data_holder).modalOptions.projectTitle;
            var hit_reward = JSON.parse($data_holder).modalOptions.monetaryReward.amountInDollars;
            var open_list = "";
            var close_list = "";
            var stored_copy = localStorage.getItem('time_data.' + hitReview_hitId);
            if (stored_copy !== null){
                open_list = stored_copy.split('$#$')[3];
                close_list = stored_copy.split('$#$')[4];
            }
            if (action_type == "openWorker"){
                open_list += "?" + now_in_milliseconds;
            }
            else if (action_type == "closeWorker"){
                close_list += "?" + now_in_milliseconds;
            }
            var autoapprove_data = requester_name + "$#$" + hit_title + "$#$"+ hit_reward +"$#$" + open_list + "$#$" + close_list;
            console.log(autoapprove_data);
            localStorage.setItem('time_data.' + hitReview_hitId, autoapprove_data);

        }
}

function mergeIntervals(intervals) {
    // test if there are at least 2 intervals
    if(intervals.length <= 1)
        return intervals;

    var stack = [];
    var top   = null;

    // sort the intervals based on their start values
    intervals = intervals.sort(function (startValue, endValue) {
        if (startValue[0] > endValue[0]) {
            return 1;
        }
        if (startValue[0] < endValue[0]) {
            return -1;
        }
        return 0;
    });

    // push the 1st interval into the stack
    stack.push(intervals[0]);

    // start from the next interval and merge if needed
    for (var i = 1; i < intervals.length; i++) {
        // get the top element
        top = stack[stack.length - 1];

        // if the current interval doesn't overlap with the
        // stack top element, push it to the stack
        if (top[1] < intervals[i][0]) {
            stack.push(intervals[i]);
        }
        // otherwise update the end value of the top element
        // if end of current interval is higher
        else if (top[1] < intervals[i][1])
        {
            top[1] = intervals[i][1];
            stack.pop();
            stack.push(top);
        }
    }

    return stack;
}

function combineIntervals(intervals, padding) {
    // test if there are at least 2 intervals
    if(intervals.length <= 1)
        return intervals;

    var stack = [];
    var top = null;

    // push the 1st interval into the stack
    stack.push(intervals[0]);

    // start from the next interval and merge if needed
    for (var i = 1; i < intervals.length; i++) {
        // get the top element
        top = stack[stack.length - 1];

        // if the current interval doesn't overlap with the
        // stack top element, push it to the stack
        if ((intervals[i][0]-top[1]) > padding) {
            //  console.log("hi",(intervals[i][0]-top[1]) + padding);
            stack.push(intervals[i]);
        }
        // otherwise update the end value of the top element
        // if end of current interval is higher
        else if (top[1] < intervals[i][1])
        {
            top[1] = intervals[i][1];
            stack.pop();
            stack.push(top);
        }
    }
    //console.log("stack",stack);
    return stack;
}

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function Remove_Old_Data(){
    var today = new Date();
    var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    if (localStorage.getItem('mturkHourlyRemovalDate') != date){
        console.log('mturk hourly data older than 14 days has been cleared');

        //thanks to @ChrisTurk for the old key removal code:
        Object.keys(localStorage)
            .forEach(function(key){
            if (/^time_data\./.test(key)) {
                console.log(localStorage[key]);
                var stored = localStorage[key].split(/\?/).pop(); // grabs last timestamp from the stack
                // days * hours * min * sec * 1000 [millisec 'cause of the way its stored]
                if (($.now()-stored) > 14*24*60*60*1000) {
                    // console.log('older than 14 days');
                    localStorage.removeItem(key); //uncomment this line to delete keys
                } else {
                    //  console.log('fresh memes'); //less than 1 day old, don't delete it.
                }
            }
        });
        localStorage.setItem('mturkHourlyRemovalDate',date);
    }
}
