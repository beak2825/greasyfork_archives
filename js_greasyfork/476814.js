// ==UserScript==
// @name         DaySummarizer
// @namespace    https://greasyfork.org/en/scripts/476814-daysummarizer
// @version      0.6
// @description  Summarizes the worked issues for Timetala
// @author       DonNadie
// @match        https://*.gitlab.com/*
// @match        https://*.atlassian.net/*
// @grant        GM.xmlHttpRequest
// @grant        GM.setValue
// @grant        GM.getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/476814/DaySummarizer.user.js
// @updateURL https://update.greasyfork.org/scripts/476814/DaySummarizer.meta.js
// ==/UserScript==


class DaySummarizer {

  constructor() {
    if (window.location.host.includes('.atlassian.net')) {
      setTimeout(() => {
        this.runPendingRequests();
      }, 2000);
    } else {
      this.setupLink();
    }
  }

  setupLink () {
    const div = document.createElement('span');
    div.innerHTML = `
      <img style="width: 20px;cursor: pointer" title="Summarize my day" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAmCAMAAADkx9tQAAAAIGNIUk0AAHomAACAhAAA+gAAAIDoAAB1MAAA6mAAADqYAAAXcJy6UTwAAAHsUExURQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgIDQAAARYcJERXcERWbxIXHnqcyZ3J/zxMYpvG/wwME0hHbltZjFpZi1tajFJQfgwLEis3Rl95nF55m4Km1pzH/0hHbz49YJeU6JeV6pSS5JWT5YaEzhMSHkhcdqDM/57J/5zI/wAAAEtKdJiW619dkignPiUkOyEgNQEAAzdGWprF/peV6TY1VAsMCUdHRkxMSk1NTDAwLwwQFW6NtjU0UzEyMOjo6Pb29vf399TU1DU0NAsPFUBSa1dwkFhxkVhwkTIyMezs7Pr6+vn5+fv7+2NjYiEhIBUUFN/f39LS0tHR0f39/f7+/v////z8/MrKypmZmaGhoeTk5MTExMnJyXJycg0NDQ8PDxkZGbe3t2FhYW5ubsjIyM7OzvHx8eHh4fPz8+fn5+bm5oKCgiYmJigoKKysrGdnZ2hoaL+/v4eHh3Z2dhQUFBYWFhcXF+vr69XV1e7u7t3d3Xp6ehoaGhwcHB0dHbi4uHt7e+/v7zc2VQcHBDQ0Mjc3NmdlnzU0UjIyTzIxTzo5WZSS5To5WkxLdkxLdU6NTWQAAAAedFJOUwA9vfe/PjDYMQclLy6lJiKh5u3756MjsLH49aD+HGnW0GwAAAABYktHRGolYpUOAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH5woGCCI1V1wVXAAAAfFJREFUOMtjYEACjEzMzCysDDgAG7ucvIIcOweKICcXNwTw8CoqKSsrKfLyQAX4OBkY+AUEhaBAWEUVCFSEYXwRUTEGcTV1DU1NLW0dXT19A0NVVUMDfT1dHW0tTU0NIzUJBkljE1MzM3MLSytrG1uQblsbaytLC3MzM1MTY0kGO3sHRydnZxdXN3dVKHB3c3VxdnZydLC3A0p7eHp5+/j6+QcY2oCBYYC/n6+Pt5enB0Q6MCg4JDQsPCIyKjomJjoqMiI8LDQkOCgQJh0bF5+QGJaUnAIGyUlhiQnxcbEo0gmJoalp6UCQlhqamIAhnZiRmZWRnZmZmJGVmYGhOz4nNzcvP76gMDE/Lzc3Jx5dd1FxSWlZfHlFdllpSXERhu78wsqq6via/PjqqsrCfAzd8dnZ2UASzkB3eTwSwHR5bV09HNTVYkg3NDbBQWMDhtOaW1rhoKUZw2mJKADTaagAXTo7AwlkY9jd1o4E2jDs7ujs6oaCrs4ODMN7epFAD4Z0PLLD40mV7utHAn0Y0hMmTpoMBZMmTsDw2JQJU+FgwhR0j8WjBguKtF/NtD40MK3GDyptOn3GzFkYYOaM6aZgaYfZc+bOwwBz58wG5TGp+QscPLAChwXzpRikZRYuWowVLFooI80gKy1lhwNIScsCAHW9ftes7sL6AAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDIzLTEwLTA2VDA4OjM0OjQ3KzAwOjAwiPW8cgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAyMy0xMC0wNlQwODozNDo0NyswMDowMPmoBM4AAAAodEVYdGRhdGU6dGltZXN0YW1wADIwMjMtMTAtMDZUMDg6MzQ6NTMrMDA6MDCWWAGcAAAAAElFTkSuQmCC">
    `;
    div.addEventListener("click", () => {
      const settings = this.getSettings();
      if (settings.jira) {
        this.show();
      } else {
        this.showSetupModal();
      }
    });
    document.querySelector('#super-sidebar .brand-logo').parentElement.append(div);
  }

  async show (date) {
    if (!date) {
      date = this.today();
    }
    const modal = this.getModal();
    const summary = await this.getIssuesFromActivity(date);
    const body = modal.querySelector('#daysummarizer-issues');
    body.innerHTML = `
      <div class="row">
        <div class="col-9">
            Issue
        </div>
        <div class="col-1 text-center">
            Hours
        </div>
        <div class="col-2 text-center">
            Time
        </div>
      </div>
    `;

    for (const issue of summary.issues) {
      const div = document.createElement('div');
      div.classList.add('row');
      div.dataset.issueRow = issue.fields.parent ? issue.fields.parent.key : issue.key;

      let parent = '';

      if (issue.fields.parent) {
        parent = `[<a href="${issue.fields.parent.link}" target="_blank">${issue.fields.parent.key}</a>] ${issue.fields.parent.fields.summary}`;
      }
      const timeSpent = issue.status.isInProgress ? parseInt(8 / summary.inProgressIssues) : 0;

      div.innerHTML = `
           <div class="col-9 my-auto text-truncate" title="${issue.fields.summary}">
              <strong class="${issue.status.isInProgress ? '' : 'text-secondary'}">[${issue.status.name}]</strong>${parent} ->
              [<a href="${issue.link}" target="_blank">${issue.key}</a>] ${issue.fields.summary}
          </div>
          <div class="col-1 text-center">
            <input value="${timeSpent}" name="adjusted-time" type="number" class="form-control">
          </div>
          <div class="col-2 my-auto text-center">
            <input name="start-time" type="time" class="form-control w-auto d-inline-block"> - <span data-end-time></span>
          </div>

       `;
      div.querySelector('[name="adjusted-time"]').addEventListener('change', () => {
        this.calculateTimeRanges();
      });
      body.append(div);
    }
    this.addSummary(body);
    this.calculateTimeRanges();
    modal.classList.add('show');
    modal.classList.remove('d-none');
  }

  addSummary (body) {
    const div = document.createElement('div');
    div.classList.add('row', 'mt-1');
    div.innerHTML = `
        <div class="col-9 my-auto text-truncate">
        </div>
        <div class="col-1 text-center">
            Total <span id="summarizer-total-hours"></span>
        </div>
        <div class="col-2 my-auto">
        </div>
   `;
    body.append(div);
  }

  calculateTimeRanges () {
    const modal = this.getModal();
    const settings = this.getSettings();
    const startTime = settings.startTime.split(':');
    const startRange = new Date();
    startRange.setHours(parseInt(startTime[0]), parseInt(startTime[1]));
    let totalHours = 0;

    for (const row of modal.querySelectorAll('[data-issue-row]')) {
      const endTime = row.querySelector('[data-end-time]');
      const el = row.querySelector('[name="start-time"]');
      const adjustedTime = parseInt(row.querySelector('[name="adjusted-time"]').value);

      if (adjustedTime < 1) {
        continue;
      }
      totalHours += adjustedTime;

      el.value = this.getOnlyTime(startRange);

      startRange.setHours(startRange.getHours() + adjustedTime);

      endTime.innerHTML = this.getOnlyTime(startRange);
    }
    const hoursContainer = document.getElementById('summarizer-total-hours');
    hoursContainer.innerHTML = totalHours;
    if (totalHours > 8) {
      hoursContainer.classList.add('text-danger');
    } else {
      hoursContainer.classList.remove('text-danger');
    }
  }

  getOnlyTime (date) {
    return this.twoDigits(date.getHours()) + ":" + this.twoDigits(date.getMinutes());
  }

  twoDigits (number) {
    return number > 9 ? number : "0" + number;
  }

  today () {
    return new Date().toISOString().split("T")[0];
  }

  getAdjacentDates(inputDate) {
    // Convert input string to a Date object
    let date = new Date(inputDate);

    // Adjust for possible timezone issues
    if (isNaN(date.getTime())) {
        throw new Error("Invalid date format. Use YYYY-MM-DD.");
    }

    // Get the previous date
    let previousDate = new Date(date);
    previousDate.setDate(date.getDate() - 1);

    // Get the next date
    let nextDate = new Date(date);
    nextDate.setDate(date.getDate() + 1);

    // Format as YYYY-MM-DD
    const formatDate = (date) => date.toISOString().split('T')[0];

    return {
        previous: formatDate(previousDate),
        next: formatDate(nextDate)
    };
  }

  async getIssuesFromActivity (date) {
    const userId = await this.getUserId();
    const splittedDate = date.split("-");
    const adjacentDates = this.getAdjacentDates(date);
    const dayBefore = adjacentDates.next;
    const dayAfter = adjacentDates.previous;

    const events = await this.query('https://gitlab.com/api/v4/users/' + userId + '/events?' + (new URLSearchParams({
      "before": dayAfter,
      "after": dayBefore,
    }).toString()));
    let issueIds = [];

    for (const event of events) {
      let messages = [];
      switch (event["action_name"]) {
        case "pushed to":
        case "pushed new":
          messages.push(event["push_data"]["ref"]);
          messages.push(event["push_data"]["commit_title"]);
          break;
        case "accepted":
        case "opened":
          messages.push(event["target_title"]);
          break;
      }

      for (const message of messages) {
        const issue = this.detectIssue(message);
        if (issue && !issueIds.includes(issue)) {
          issueIds.push(issue);
        }
      }
    }

    const issues = [];
    let inProgressIssues = 0;
    const jiraSubdomain = this.getSettings().jira;

    for (const issueId of issueIds) {
      const issue = await this.getIssue(issueId, jiraSubdomain);
      if (issue.status.isInProgress) {
        inProgressIssues++;
      }
      issues.push(issue);
    }

    return {
      issues,
      inProgressIssues
    };
  }

  async getIssue (issueId, subdomain) {
    const response = await this.query(`https://${subdomain}.atlassian.net/rest/api/3/issue/` + issueId);

    response.link = `https://${subdomain}.atlassian.net/browse/` + response.key;
    response.status = response.fields.parent ? response.fields.parent.fields.status : response.fields.status;
    response.status.isInProgress = ['In progress', 'In Progress'].includes(response.status.name);
    if (response.fields.parent) {
      response.fields.parent.link = `https://${subdomain}.atlassian.net/browse/` + response.fields.parent.key;

      if (response.fields.parent.labels && response.fields.parent.labels.includes("hide_board")) {
        response.status.isInProgress = false;
      }
    }
    if (response.fields.labels && response.fields.labels.includes("hide_board")) {
      response.status.isInProgress = false;
    }

    return response;
  }

  detectIssue(message) {
    const regexs = [
      /([A-Z]+-[0-9]{1,5})[-|_]/, // EYFN-94_Track_errors, EYFN-94-Track_errors
      /\[([A-Z0-9-]+)\]/, // [EYFN-94] + Track
    ];

    for (const regex of regexs) {
      const matches = message.match(regex);
      if (matches) {
        return matches[1].trim();
      }
    }

    return null;
  }

  async getUserId () {
    if (localStorage.getItem('user_id')) {
      return localStorage.getItem('user_id');
    }
    const preferences = await this.query('https://gitlab.com/api/v4/user/preferences');

    localStorage.setItem('user_id', preferences.user_id);
    return preferences.user_id;
  }

  async query (url, body) {
    return new Promise((resolve) => {
      GM.xmlHttpRequest({
        method: body ? 'POST' : "GET",
        data: body ? JSON.stringify(body) : null,
        url: url,
        onload: function(response) {
          let result = response.responseText;
          try {
            result = JSON.parse(response.responseText)
          } catch (e){}
          resolve(result);
        }
      });
    });
  }

  showSetupModal () {
    let modal = document.getElementById('daysummarizer-setup-modal');
    if (modal) {
      return modal;
    }

    const html = `
      <div id="daysummarizer-setup-modal" class="modal fade show" tabindex="-1" aria-modal="true" role="dialog" style="display: block;">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Day summary setup</h5>
              <button type="button" class="btn-close btn" data-bs-dismiss="modal" aria-label="Close">X</button>
            </div>
            <div class="modal-body text-center">
              <div>
                    <label>
                        Paste any JIRA issue link
                        <input placeholder="https://mycompany.atlassian.net/browse/EYFN-94" type="url" class="form-control" required>
                    </label>
                    <p><small>(so company subdomain can be obtained for JIRA requests)</small></p>

              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button data-action="save" type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>
    `;

    const doc = document.createElement("div");
    doc.innerHTML = html;
    document.body.append(doc);

    modal = document.getElementById('daysummarizer-setup-modal');

    modal.querySelectorAll('[data-bs-dismiss="modal"]').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.remove();
      });
    });

    modal.querySelector('[data-action="save"]').addEventListener('click', () => {
      const url = modal.querySelector('input').value;
      if (url.length < 2) {
        return;
      }
      const subdomain = new URL(url).host.split('.')[0];

      if (subdomain.length < 2) {
        return;
      }
      this.updateSettings({jira: subdomain});
      modal.remove();
      this.show();
    });
  }

  getModal () {
    let modal = document.getElementById('daysummarizer-modal');
    if (modal) {
      return modal;
    }
    const settings = this.getSettings();
    const html = `
      <div id="daysummarizer-modal" class="modal fade show" tabindex="-1" aria-modal="true" role="dialog" style="display: block;">
        <div class="modal-dialog modal-xl">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Day summary</h5>
              <button type="button" class="btn-close btn" data-bs-dismiss="modal" aria-label="Close">X</button>
            </div>
            <div class="modal-body">
              <div>
                    <label>
                        Date
                        <input value="${this.today()}" type="date" class="form-control">
                    </label>
                    <label>
                        Start time
                        <input value="${settings.startTime ?? '08:00'}" name="start-time" type="time" class="form-control">
                    </label>
                    <label>
                        Lunch time
                        <input value="${settings.lunchTime ?? '01:00'}" name="lunch-time" type="time" class="form-control">
                    </label>
              </div>
              <div id="daysummarizer-issues">
                <p>Loading, lol, loading</p>
              </div>
            </div>
            <div class="modal-footer">
              <a href="https://${settings.jira}.atlassian.net/plugins/servlet/ac/jp.dssolution.jira.timela/main-page" target="_blank">View worklog</a>
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button data-action="save" type="button" class="btn btn-primary">Submit worklog</button>
            </div>
          </div>
        </div>
      </div>
    `;
    const doc = document.createElement("div");
    doc.innerHTML = html;
    document.body.append(doc);

    modal = document.getElementById('daysummarizer-modal');

    modal.querySelectorAll('[data-bs-dismiss="modal"]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeModal();
      });
    });

    const selectedDate = modal.querySelector('[type="date"]');
    selectedDate.addEventListener('change', () => {
      modal.querySelector("#daysummarizer-issues").innerHTML = 'Loading, lol, loading';
      this.show(selectedDate.value);
    });

    const startTime = modal.querySelector('[name="start-time"]');
    startTime.addEventListener('change', () => {
      this.updateSettings({
        startTime: startTime.value
      });
      this.calculateTimeRanges();
    });

    const lunchTime = modal.querySelector('[name="lunch-time"]');
    lunchTime.addEventListener('change', () => {
      this.updateSettings({
        lunchTime: lunchTime.value
      });
      this.calculateTimeRanges();
    });

    const button = modal.querySelector('[data-action="save"]');
    button.addEventListener('click', () => {
      button.setAttribute('disabled', 'disabled');
      this.submitAllWorkLogs();
    });

    return modal;
  }

  async submitAllWorkLogs () {
    const modal = this.getModal();
    const settings = this.getSettings();
    const selectedDate = modal.querySelector('[type="date"]').value;
    let pendingRequests = [];

    for (const row of modal.querySelectorAll('[data-issue-row]')) {
      const adjustedTime = parseInt(row.querySelector('[name="adjusted-time"]').value);
      const startTime = row.querySelector('[name="start-time"]').value;

      if (adjustedTime < 1) {
        return;
      }
      let isoStartTime = selectedDate + "T" + startTime + ':00.000+0200';

      pendingRequests.push({
        issueId: row.dataset.issueRow,
        startDate: isoStartTime,
        hours: adjustedTime,
        subdomain: settings.jira
      });
    }

    await GM.setValue("pending_requests", JSON.stringify(pendingRequests));

    // open jira so we can run the jobs there
    window.open(`https://${settings.jira}.atlassian.net/plugins/servlet/ac/jp.dssolution.jira.timela/main-page`);
  }

  async submitWorkLog (issueId, startDate, hours, subdomain) {
    return await fetch(`https://${subdomain}.atlassian.net/rest/api/3/issue/${issueId}/worklog?newEstimate=0h&adjustEstimate=new&_r=` + (new Date()).getTime(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "started": startDate,
        "timeSpent": hours + "h"
      })
    });
  }

  async runPendingRequests () {
    let list = await GM.getValue("pending_requests");

    if (!list) {
      return;
    }

    list = JSON.parse(list);

    for (const request of list) {
      await this.submitWorkLog(request.issueId, request.startDate, request.hours, request.subdomain);
    }

    await GM.setValue("pending_requests", "");
    location.reload();
  }

  getSettings () {
    let db = localStorage.getItem("day-summarizer");
    if (!db) {
      db = {};
    } else {
      db = JSON.parse(db);
    }
    return db;
  }

  updateSettings (changes) {
    let db = this.getSettings();
    for (const key of Object.keys(changes)) {
      db[key] = changes[key];
    }
    localStorage.setItem("day-summarizer", JSON.stringify(db));
  }

  closeModal () {
    const modal = this.getModal();
    modal.classList.remove('show');
    modal.classList.add('d-none');
  }
}

(function() {
  'use strict';
  window.daySummarizer = new DaySummarizer();
  document.body.daySummarizer = window.daySummarizer;
})();