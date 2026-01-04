// ==UserScript==
// @name           Memrise Course Spreadsheet
// @description    Allows to see all words of a course / selected levels and to export them in CSV format
// @match          http://*.memrise.com/course/*
// @match          https://*.memrise.com/course/*
// @match          https://*.memrise.com/community/course/*
// @run-at         document-end
// @version        1.4.3
// @grant          none
// @namespace      https://greasyfork.org/users/213706
// @downloadURL https://update.greasyfork.org/scripts/372431/Memrise%20Course%20Spreadsheet.user.js
// @updateURL https://update.greasyfork.org/scripts/372431/Memrise%20Course%20Spreadsheet.meta.js
// ==/UserScript==

/* jshint esversion: 8 */

if(typeof unsafeWindow == "undefined") {
  unsafeWindow = window;
}

//+--------------------------------------------------------
//|
//| ADD SPEADSHEET TAB
//|
//+--------------------------------------------------------

function onLoad() {
  if(typeof unsafeWindow.MEMRISE == "undefined") {
    return;
  }
  if(!document.getElementById('content') || document.body.classList.contains('course_edit')) {
    return;
  }

  // Get the current course canonical link and ID
  var navbar     = document.querySelector('.course-tabs-wrap .nav'),
      linkCourse = navbar.children[0].querySelector('a').getAttribute('href'),
      getId      = linkCourse.match(/\/course\/(\d+)\//);

  if(!getId || window.location.pathname != linkCourse) {
    return;
  }

  // Add tab Spreadsheet in navbar
  var link       = linkCourse + '#spreadsheet';
      idCourse   = getId[1];

  var li = document.createElement('li'),
      a  = document.createElement('a');

  a.setAttribute('href', link);
  a.innerHTML = 'Spreadsheet';
  li.appendChild(a);

  navbar.appendChild(li);

  // Handle switching to Spreadsheet tab
    var courseTitle      = document.querySelector('h1.course-name').innerText.trim(),
      docTitle           = `Spreadsheet - ${courseTitle} - Memrise`,
      openSpreadsheetTab = openTab.bind(null, {docTitle, linkCourse, idCourse}, li);  

  // ... via URL/click
  if(window.location.hash === "#spreadsheet") {
    openSpreadsheetTab();
  } else {
    li.addEventListener("click", function(){
      unsafeWindow.history.pushState({}, docTitle, link);

      openSpreadsheetTab();
    });
  }

  // ... via browser's back or forward button
  window.addEventListener('popstate', function(e){
    if(window.location.hash === "#spreadsheet") {
        openSpreadsheetTab();
    } else {
        window.location.reload();
    }
  });
}

//+--------------------------------------------------------
//|
//| RENDER CONTENT OF TAB (form)
//|
//+--------------------------------------------------------

function getCookies() {
  let cookie = {};
  document.cookie.split(';').forEach(function(el) {
    let [k,v] = el.split('=');
    cookie[k.trim()] = v;
  })
  return cookie;
}

/**
 * @param object courseInfo - {docTitle, linkCourse, idCourse}
 * @param DOMElement li     - li to set active in navbar
 */
function openTab(courseInfo, li) {
  if(li.classList.contains('active')) {
    return;
  }
  document.title = courseInfo.docTitle;

  // Set the class "active" on tab
  var tab = li;
  while(tab = tab.previousElementSibling) {
    tab.classList.remove("active");
  }
  li.classList.add("active");

  // Get the list of levels
  var container = document.getElementById('content').firstElementChild,
      levelElms = container.querySelectorAll('.level'),
      levels    = [],
      selectbox = {0: "", 1: ""};

  for(let i=0; i<levelElms.length; i++) {
    var elm   = levelElms[i],
        ico   = elm.querySelector('.level-ico').classList,
        level = {
          href : elm.getAttribute('href'),
          idx  : elm.querySelector('.level-index').innerText.trim(),
          title: elm.querySelector('.level-title').innerText.trim(),
          media: (ico.contains('level-ico-multimedia-inactive') || ico.contains('level-ico-multimedia'))
        };
    levels.push(level);
    selectbox[level.media ? 1 : 0] += `<option value="${i}" selected>${level.idx}. ${level.title}</option>`;
  }
  levelElms = null;

  // Empty the page
  container.innerHTML = `
    <style>
      #spreadsheet_conf legend { font-weight: 600; }
      #spreadsheet_conf :disabled { opacity: 0.5; }
      #spreadsheet_conf td { padding: 5px; }

      #spreadsheet_conf .form-inline div { float: right; }
      #spreadsheet_conf .form-check-label,
      #spreadsheet_conf .form-check-input { display: inline-block; }
      #spreadsheet_conf .actions { margin-top: 10px; }

      #spreadsheet_conf button.icon {
          font-size: 2em;
          background: none;
          border: 0;
          box-shadow: none;
          padding: 0;
          opacity: 0.5;
      }
      #spreadsheet_conf button.icon:hover {
          opacity: 1;
      }

      #spreadsheet .loading {
          width: 100%;
          height: 32px;
          position: relative;
          top: -10px;

          background-image: url("https://static.memrise.com/img/icons/loader@2x.gif");
          background-position: center center;
          background-size: 32px 32px;
          background-repeat: no-repeat;
      }
      #spreadsheet { border-top: 1px solid #e5e5e5; padding-top: 20px; }
      #spreadsheet:empty { border-top-color: transparent; }

      #spreadsheet table {
        background: white;
        table-layout: fixed;
        width: 100%;
      }
      #spreadsheet td,
      #spreadsheet th {
        border: 1px solid #e4e4e4;
        padding: 2px 5px;
        vertical-align: top;
      }
      #spreadsheet .num {
        background: rgba(0,0,0,0.03);
        text-align: right;
        width: 5%;
      }
      #spreadsheet td.num {
        color: rgba(0,0,0,0.6);
        white-space: nowrap;
      }
      #spreadsheet td.num.ignored {
        color: rgba(0,0,0,0);
      }
      #spreadsheet .score.left {
        border-right-color: transparent;
        padding-right: 0;
      }
      #spreadsheet .score.right::before {
        content: "/";
        color: rgba(0,0,0,0.2);
      }
      #spreadsheet .score.right.ignored::before {
        content: "-";
        color: rgba(0,0,0,0.6);
      }
      #spreadsheet .score.right {
        text-align: left;
        padding-left: 0;
      }
      #spreadsheet .score.often-missed { color:#ff725b; }
      #spreadsheet .score.sometimes-missed { color:#f08700; }

      #spreadsheet .course-title { font-weight: normal; font-size: 22px; }
      #spreadsheet audio, #spreadsheet video { display: block; max-width: 100%; }

      #spreadsheet .alt span { color: rgba(0,0,0,0.4); }
      #spreadsheet .alt span::before { content: "- "; }

      #spreadsheet .more { margin: 5px 0; }
      #spreadsheet .more + .more { margin-top: 10px; }
      #spreadsheet .more span { padding: 0 5px; line-height: 1em; }
      #spreadsheet .highlight {
        display: block;
        border-bottom: 2px solid white;
        color: rgba(0,0,0,0.4);
      }
    </style>`.replace(/\s+/g, ' ');

  var tooltip = document.querySelector('.tooltip.in');
  if(tooltip) {
    tooltip.parentNode.removeChild(tooltip);
    tooltip = null;
  }

  // Add the selectBox of levels / checkbox display alternatives
  container.innerHTML += `<form id="spreadsheet_conf">
    <legend class="form-label">Spreadsheet should contain ...</legend>

    ${(!selectbox[0] && !selectbox[1]) &&
      `<input type="hidden" id="export0" value="1">`
    || ""}

    <table>
    ${(selectbox[0] || selectbox[1]) &&
      ((selectbox[0] && selectbox[1]) && `
        <tr class="form-group">
          <td class="form-inline form-ab">
            <input class="form-input chooseExport" type="radio"
                   id="chooseExport0" name="chooseExport" value="0" checked>
            <label class="form-label" for="chooseExport0">Classic levels</label>
          </td>
          <td class="form-inline form-ab">
            <input class="form-input chooseExport" type="radio"
                   id="chooseExport1" name="chooseExport" value="1">
            <label class="form-label" for="chooseExport1">Multimedia levels</label>
          </td>
        </tr>`) +

      `<tr class="form-group">
        ${selectbox[0] && `
         <td class="form-inline form-ab">
           <select id="export0" multiple>${selectbox[0]}</select>
         </td>`}
         ${selectbox[1] && `
         <td class="form-inline form-ab">
           <select id="export1" multiple ${selectbox[0] ? 'disabled' : ''}>${selectbox[1]}</select>
         </td>`}
      </tr>`
    }

    <tr class="form-group">
      <td class="form-inline">
        Display:
        <div>
          <input class="form-input" type="checkbox"
                 id="exportAlt" name="exportAlt" value="1">
          <label class="form-label" for="exportAlt">Alternative answers</label>

          <br>
          <input class="form-input" type="checkbox"
                 id="exportMore" name="exportMore" value="1">
          <label class="form-label" for="exportMore">Additional informations</label>
        </div>
      </td>
    </tr>
    </table>

    <div class="actions">
      <button type="submit" name="render">Render</button>
      <button type="submit" name="export">Export CSV</button>
      <button type="button" id="exportInMemory" style="display: none"
              class="icon" title="Export CSV using data in memory (rendered below)">&DownArrowBar;</button>
    </div>
  </form>
  <div id="spreadsheet"></div>`;

  // Choose to export either multimedia or classic levels
  if(selectbox[0] && selectbox[1]) {
    document.getElementById('chooseExport0').addEventListener('click', chooseExport);
    document.getElementById('chooseExport1').addEventListener('click', chooseExport);

    function chooseExport(){
      var val = this.value;

      document.getElementById(`export${val}`).disabled = false;
      document.getElementById(`export${1 - val}`).disabled = true;
      document.getElementById(`exportAlt`).disabled = (val == 1);
      document.getElementById(`exportMore`).disabled = (val == 1);
    }
  }

  // Export using in memory data
  document.getElementById('exportInMemory').addEventListener("click", function(){
    new ExportInMemory();
  });

  // On render/export
  document.getElementById("spreadsheet_conf").addEventListener("submit", function(e){
    e.preventDefault();

    // Get the list of levels selected
    var levelsToExport = [],
        isMultimedia   = (typeof this.elements.export0 == "undefined" || this.elements.export0.disabled) ? 1 : 0,
        item           = this.elements[`export${isMultimedia}`],
        exportAlt      = !isMultimedia && this.elements.exportAlt.checked,
        exportMore     = !isMultimedia && this.elements.exportMore.checked;

    // Course with no level: retrieve level 1 (ex: /course/233943/livre-1001-phrases-pour-parler-allemand/)
    if(item.type && item.type == "hidden") {
      levelsToExport.push({
          href : courseInfo.linkCourse,
          idx  : 1,
          title: '',
          media: false
        });

    // Retrieve selected levels
    } else {
      for(let i = 0; i < item.options.length; i++) {
        if(item.options[i].selected) {
          var rank = item.options[i].value;

          levelsToExport.push(levels[rank]);
        }
      }
    }

    // Render or export spreadsheet
    if(isMultimedia) {
      if(document.activeElement.name == "export"){
        new ExportMultimedia(courseInfo.linkCourse, levelsToExport);
      } else {
        new SpreadSheetMultimedia(courseInfo.linkCourse, levelsToExport);
      }

    } else {
      if(document.activeElement.name == "export"){
        new Export(courseInfo.idCourse, levelsToExport, exportAlt, exportMore);
      } else {
        new SpreadSheet(courseInfo.idCourse, levelsToExport, exportAlt, exportMore);
      }
    }
  });
}

//+--------------------------------------------------------
//|
//| RENDER SPREADSHEET (table)
//|
//+--------------------------------------------------------

class SpreadSheet {

  // DOMElement this.body
  // integer    this.idCourse
  // array      this.levels
  // boolean    this.exportAlt

  /**
   * @param string idCourse
   * @param array levels
   * @param boolean exportAlt  - Export alternatives answers
   * @param boolean exportMore - Export extra columns (visible_info, hidden_info, attributes)
   */
  constructor(idCourse, levels, exportAlt, exportMore) {
    this.idCourse   = idCourse;
    this.levels     = levels;
    this.exportAlt  = exportAlt;
    this.exportMore = exportMore;
    this.cookies    = getCookies();

    // Display a loader
    var container  = document.getElementById("spreadsheet"),
        loading    = this.createLoader(container);

    // Create the spreadsheet
    this.extraHeaders = {};
    this.createBody(container);
    this.createContent(loading);
  }

  /**
   * Create the loader and it to the container
   * @param DOMElement container
   * @return DOMElement
   */
  createLoader(container) {
    var loading = document.createElement("div");

    loading.setAttribute("class", "loading");
    container.innerHTML = "";
    container.appendChild(loading);

    document.getElementById('exportInMemory').style.display = 'none';
    return loading;
  }

  /**
   * Create a table
   * @return DOMElement
   */
  createBody(container) {
    var table = document.createElement("table");
    container.appendChild(table);

    table.innerHTML = `<thead><tr>
      <th class="lvl-idx num">Level</th>
      <th class="item-idx num">#</th>
      <th class="item-label">Label</th>
      <th class="item-definition">Definition</th>
      <th class="score num" colspan="2">Score</th>
      ${this.exportMore ? `<th class="item-more">More</th>` : ``}
      </tr></thead>
      <tbody></tbody>`;

    this.body = table.lastElementChild;
  }

  /**
   * Populate the body
   */
  async createContent(loading) {
    var n       = this.levels.length-1,
        hasErr  = false;

    for(let i = 0; i <= n; i++) {
      let level = this.levels[i];

      let options = {
        method: 'POST',
        credentials: 'include',
        referrer: `https://${window.location.host}/aprender/preview?course_id=${this.idCourse}&level_index=${level.idx}`,
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.cookies['csrftoken'] ?? '',
        },
        body: JSON.stringify({
          session_source_id: parseInt(this.idCourse),
          session_source_sub_index: parseInt(level.idx),
          session_source_type: "course_id_and_level_index",
        }),
      };
      await fetch(`https://${window.location.host}/v1.21/learning_sessions/preview/`, options)
      .then((response) => {
        // Returns 400 if column b isn't defined
        return response.ok ? response.json() : null;
      })
      .then((data) => {
        if(data) {
          var rows   = data.learnables,
              scores = data.progress; // current user scores

          for(let j = 0; j < rows.length; j++) {
            var item = rows[j];

            this.createRow(
              level,
              j,
              item.screens[1], // includes attributes as well
              scores && scores[j]
            );
          }
        }
        if(i == n && loading){
          loading.parentNode.removeChild(loading);
          loading = null;
        }

      }).catch((e) => {
        hasErr = true;
        unsafeWindow.console.error(e);

        loading.setAttribute('class', 'alert alert-danger');
        loading.innerHTML = `Something went wrong. Please contact the developer of this script if the error persists.`;
      });

      if(hasErr) {
        break;
      }
    }
    this.end(hasErr);
  }

  /**
   * Returns the URL to retrieve the words of a level
   * @param string|integer idLevel
   * @return string
   */
  getUrl(idLevel) {
    return `https://${window.location.host}/ajax/session/?course_id=${this.idCourse}&level_index=${idLevel}&session_slug=preview`;
  }

  /**
   * Create a new row
   * @param object level  - Data about current level
   * @param integer j     - Current row number
   * @param object data   - Row data
   * @param object score  - User score for current word
   * @param object data
   */
  createRow(level, j, data, score) {
    var tr   = document.createElement('tr'),
        html = "";

    html  = `<td class="lvl-idx num"><a href="${level.href}">${level.idx}</a></td>`;
    html += `<td class="item-idx num">${j+1}</td>`;
    html += `<td class="item-label">${this.getValue(data.item)}</td>`;
    html += `<td class="item-definition">${this.getValue(data.definition)}</td>`;
    html += this.getScore(score);

    if(this.exportMore) {
      html += `<td class="item-more">`;
      html += data.visible_info.map(it => {this.addExtraHeader(it.label); return `<div class="more"><span class="highlight">${it.label}</span> ${this.getValue(it, false)}</div>`;}).join('');
      html += data.hidden_info.map(it => {this.addExtraHeader(it.label); return `<div class="more"><span class="highlight">${it.label}</span> ${this.getValue(it, false)}</div>`;}).join('');
      html += data.attributes.map(it => {this.addExtraHeader(it.label); return `<div class="more"><span class="highlight">${it.label}</span> <span>${escapeHTML(it.value)}</span></div>`;}).join('');
      html += `</td>`;
    }
    tr.innerHTML = html;
    this.body.appendChild(tr);
  }

  /**
   * Keep in mind the extra columns in "More"
   * To be able to export the rendered table to CSV
   * @param string label
   */
  addExtraHeader(label) {
    if(typeof this.extraHeaders[label] == 'undefined') {
      let k = Object.keys(this.extraHeaders).length;

      this.extraHeaders[label] = k;
    }
  }

  /**
   * Returns HTML: the content of the columnm (text, image, audio or video)
   * @param object item
   * @param boolean[optional] checkAlt - [true] Used to disable alternatives in additionnal informations
   * @return string
   */
  getValue(item, checkAlt=true) {
    var txt = "";

    switch(item.kind) {
      case "text" :
        txt = `<span>${escapeHTML(item.value)}</span>`;
        if(checkAlt && this.exportAlt) {
          for(let i=0; i<item.alternatives.length; i++) {
            txt += `<div class="alt">`;
            txt += `<span>${escapeHTML(item.alternatives[i])}</span>`;
            txt += `</div>`;
          }
        }
        break;

      case "image":
        txt = `<img src=${item.value[0]} class="text-image" />`;
        if(checkAlt && this.exportAlt) {
          for(let i=1; i<item.value.length; i++) {
            txt += `<div class="alt">`;
            txt += `<img src=${item.value[i]} class="text-image" />`;
            txt += `</div>`;
          }
        }
        break;

      case "audio":
        txt = `<audio src=${item.value[0].normal} controls></audio>`;
        if(checkAlt && this.exportAlt) {
          for(let i=1; i<item.value.length; i++) {
            txt += `<div class="alt">`;
            txt += `<audio src=${item.value[i].normal} controls></audio>`;
            txt += `</div>`;
          }
        }
        break;

      case "video":
        txt = `<video src=${item.value[0]} controls>Your browser does not support the video tag.</video>`;
        if(checkAlt && this.exportAlt) {
          for(let i=1; i<item.value.length; i++) {
            txt += `<div class="alt">`;
            txt += `<video src=${item.value[i]} controls>Your browser does not support the video tag.</video>`;
            txt += `</div>`;
          }
        }
        break;

      default:
        return "";
    }
    return txt;
  }

  /**
   * Returns HTML: the user's score (correct/attemps)
   * @param object score
   * @return string
   */
  getScore(score) {
    if(!score || !score.attempts) {
      return '<td class="score num" colspan="2">-</td>';
    }
    var successRate, className;

    if(score.ignored) {
      successRate = 'Ignored';
      className   = 'ignored';
    } else {
      successRate = parseInt(score.correct / score.attempts * 100) + '%';
      className   = (successRate == 100 ? "never-missed"
                     : (successRate < 20 ? "often-missed"
                        : (successRate > 80 ? "rarely-missed" : "sometimes-missed")));
    }
    return `<td class="score left num ${className}" title="${successRate}">${this.truncateNum(""+score.correct)}</td>
            <td class="score right num ${className}" title="${successRate}">${this.truncateNum(""+score.attempts)}</td>`;
  }
  
  /**
   * Make sure the number isn't longer than length, or truncate the left (1012, 3 => 12)
   * @param string str
   * @param integer[optional] length - [3]
   * @return string
   */
  truncateNum(str, length=3) {
    if(str <= length) {
      return str;
    }
    return str.substring(str.length-length).replace(/^0+/, '');
  }

  /**
   * Return the filename of the generated CSV
   * @return string
   */
  getFilename() {
    var filename = 'Memrise-' + idCourse;

    if(this.levels.length == 1) {
      filename += '-' + this.levels[0].idx;
    }
    return filename + '.csv';
  }

  /**
   * Called when all levels have been fetched and rendered
   * We keep extra data needed to export the data in-memory
   * (rather than fetching all levels all over again)
   *
   * @param boolean hasErr  Used by subclass
   */
  end(hasErr) {
    this.body.dataset.file = this.getFilename();

    // Keep extra headers labels to export current data
    if(Object.keys(this.extraHeaders).length) {
      let extra = [];

      for(let label in this.extraHeaders) {
        extra[this.extraHeaders[label]] = label;
      }
      this.body.dataset.extraHeaders = JSON.stringify(extra);

    } else {
      delete this.body.dataset.extraHeaders;
    }

    document.getElementById('exportInMemory').style.display = null;
  }
}

//+--------------------------------------------------------
//|
//| RENDER SPREADSHEET - MULTIMEDIA (table)
//|
//+--------------------------------------------------------

class SpreadSheetMultimedia {

  // DOMElement this.body
  // string     this.urlCourse
  // array      this.levels
  
  /**
   * @param string urlCourse
   * @param array levels
   */
  constructor(urlCourse, levels) {
    this.urlCourse = urlCourse;
    this.levels    = levels;

    // Display a loader
    var container = document.getElementById("spreadsheet"),
        loading   = this.createLoader(container);

    // Create the spreadsheet
    this.createBody(container);
    this.createContent(loading);
  }

  /**
   * Create the loader and it to the container
   * @param DOMElement container
   * @return DOMElement
   */
  createLoader(container) {
    var loading = document.createElement("div");

    loading.setAttribute("class", "loading");
    container.innerHTML = "";
    container.appendChild(loading);

    document.getElementById('exportInMemory').style.display = 'none';
    return loading;
  }

  /**
   * Create a table
   * @return DOMElement
   */
  createBody(container) {
    var table = document.createElement("table");
    container.appendChild(table);

    table.innerHTML = `<thead><tr>
      <th class="lvl-idx num">Level</th>
      <th class="item-definition">Content</th>
      </tr></thead>
      <tbody></tbody>`;

    this.body = table.lastElementChild;
  }
  
  /**
   * Populate the body
   */
  async createContent(loading) {
    var n      = this.levels.length-1,
        hasErr = false;

    for(let i = 0; i <= n; i++) {
      let level = this.levels[i];

      await fetch(this.getUrl(level.idx), {
        credentials: "same-origin"
      })
      .then((response) => response.text())
      .then((html) => {
        var data = html.match(/^ *var level_multimedia =(.*)/m);
        if(!data) {
          // Empty level (ex: /course/50121/flags-of-the-world/9/)
          return "";
        }
        eval('data = ' + data[1].trim());
        return data;
      })
      .then((data) => {
        this.createRow(level, data);

        if(i == n){
          loading.parentNode.removeChild(loading);
          loading = null;
        }

      }).catch((e) => {
        hasErr = true;
        unsafeWindow.console.error(e);

        loading.setAttribute('class', 'alert alert-danger');
        loading.innerHTML = `Something went wrong. Please contact the developer of this script if the error persists.`;
      });

      if(hasErr) {
        break;
      }
    }
    this.end(hasErr);
  }

  /**
   * Returns the URL to retrieve the words of a level
   * @param string|integer idLevel
   * @return string
   */
  getUrl(idLevel) {
    return `https://${window.location.host}${this.urlCourse}${idLevel}/`;
  }

  /**
   * Create a new row
   * @param object data
   */
  createRow(level, data) {
    var tr   = document.createElement('tr'),
        html = "";

    html  = `<td class="lvl-idx num"><a href="${level.href}">${level.idx}</a></td>`;
    html += `<td class="item-label">
               <h3 class="course-title">${escapeHTML(level.title)}</h3>
               <div class="multimedia-raw" style="display: none">${escapeHTML(data)}</div>
               <div class="multimedia-wrapper">${this.parseMarkdown(data)}</div>
             </td>`;

    tr.innerHTML = html;
    this.body.appendChild(tr);
    unsafeWindow.MEMRISE.renderer.do_embeds(unsafeWindow.$(tr));
  }

  /**
   * Converts Markdown to HTML using Memrise's renderer
   * @param string txt
   * @return string
   */
  parseMarkdown(txt) {
    return unsafeWindow.MEMRISE.renderer.rich_format(txt);
  }

  /**
   * Return the filename of the generated CSV
   * @return string
   */
  getFilename() {
    var filename = 'Memrise-' + idCourse;

    if(this.levels.length == 1) {
      filename += '-' + this.levels[0].idx;
    }
    return filename + '-multimedia.csv';
  }

  /**
   * Called when all levels have been fetched and rendered
   * We keep extra data needed to export the data in-memory
   * (rather than fetching all levels all over again)
   *
   * @param boolean hasErr  Used by subclass
   */
  end(hasErr) {
    this.body.dataset.file = this.getFilename();
    delete this.body.dataset.extraHeaders;

    document.getElementById('exportInMemory').style.display = null;
  }

}

//+--------------------------------------------------------
//|
//| EXPORT CSV
//|
//+--------------------------------------------------------

class Export extends SpreadSheet {

  /**
   * Create the loader and it to the container
   * @param DOMElement container
   * @return DOMElement
   */
  createLoader(container) {
    var loading = document.createElement("div");
    loading.setAttribute("class", "loading");

    if(container.children.length) {
      container.insertBefore(loading, container.firstElementChild);
    } else {
      container.appendChild(loading);
    }
    return loading;
  }
  
  /**
   * Init the content of the CSV
   * @return DOMElement
   */
  createBody(container) {
    this.body    = '';
    this.headers = {};
  }

  /**
   * Create a new row
   * @param object level
   * @param integer j
   * @param object data
   * @param object score
   */
  createRow(level, j, data, score) {
    this.body += level.idx + ',';
    this.body += (j+1) + ',';
    this.body += this.getValue(data.item) + ',';
    this.body += this.getValue(data.definition) + ',';

    if(score && score.attempts){
      this.body += score.correct + ',';
      this.body += score.attempts + ',';
      this.body += parseInt(score.correct / score.attempts * 100);
    } else {
      this.body += ',,';
    }

    // Retrieve additional columns
    if(this.exportMore) {
      var arr = [];

      this.getExtraColumns(arr, data.visible_info);
      this.getExtraColumns(arr, data.hidden_info);
      this.getExtraColumns(arr, data.attributes);

      // Add columns
      for(let i=0; i<arr.length; i++){
        this.body += ',';
        this.body += arr[i] || '';
      }
    }
    this.body += '\n';
  }

  /**
   * Retrieves the additional content in data
   * And puts it in the right place in arr
   * @param array arr
   * @param object[pointer] data
   */
  getExtraColumns(arr, data){
    var k;
    for(let i=0; i<data.length; i++) {
      var it = data[i];

      if(typeof this.headers[it.label] != 'undefined') {
        k = this.headers[it.label];
      } else {
        k = Object.keys(this.headers).length;
        this.headers[it.label] = k;
      }

      if(typeof it.kind != "undefined") {
        arr[k] = this.getValue(it, false);
      } else {
        arr[k] = escapeCSV(it.value);
      }
    }
  }

  /**
   * Returns CSV-escaped text: the content of the column (text, image, audio or video)
   * @param object item
   * @param boolean[optional] checkAlt - [true] Used to disable alternatives in additionnal informations
   * @return string
   */
  getValue(item, checkAlt=true) {
    var txt;

    switch(item.kind) {
      case "text" :
        txt = item.value;
        if(checkAlt && this.exportAlt) {
          for(let i=0; i<item.alternatives.length; i++) {
            txt += '\n' + item.alternatives[i];
          }
        }
        break;

      case "image":
        txt = item.value[0];
        if(checkAlt && this.exportAlt) {
          for(let i=1; i<item.value.length; i++) {
            txt += '\n' + item.value[i];
          }
        }
        break;

      case "audio":
        txt = item.value[0].normal;
        if(checkAlt && this.exportAlt) {
          for(let i=1; i<item.value.length; i++) {
            txt += '\n' + item.value[i].normal;
          }
        }
        break;

      case "video":
        txt = item.value[0];
        if(checkAlt && this.exportAlt) {
          for(let i=1; i<item.value.length; i++) {
            txt += '\n' + item.value[i];
          }
        }
        break;

      default:
        return "";
    }
    return escapeCSV(txt);
  }

  /**
   * Trigger download of the CSV (in-memory)
   * @param boolean hasErr
   */
  end(hasErr) {
    if(hasErr) {
      return;
    }
    download(this.getFilename(), this.getHeaders() + '\n' + this.body);
  }

  /**
   * Retrieve all headers
   * Includes visible_info / hidden_info / attributes if that option was checked
   * @return string
   */
  getHeaders() {
    var headers = 'Level,#,Label,Definition,Correct,Attempts,Score %';

    if(!this.exportMore) {
      return headers;
    }
    var extra = [];
    for(var label in this.headers) {
      extra[this.headers[label]] = escapeCSV(label);
    }
    return headers + (extra.length ? ',' + extra.join(',') : '');
  }
}

//+--------------------------------------------------------
//|
//| EXPORT CSV - MULTIMEDIA
//|
//+--------------------------------------------------------


class ExportMultimedia extends SpreadSheetMultimedia {

  /**
   * Create the loader and it to the container
   * @param DOMElement container
   * @return DOMElement
   */
  createLoader(container) {
    var loading = document.createElement("div");
    loading.setAttribute("class", "loading");

    if(container.children.length) {
      container.insertBefore(loading, container.firstElementChild);
    } else {
      container.appendChild(loading);
    }
    return loading;
  }
  
  /**
   * Init the content of the CSV
   * @return DOMElement
   */
  createBody(container) {
    this.body = 'Level,Title,Content\n';
  }
  
  /**
   * Create a new row
   * @param object data
   */
  createRow(level, data) {
    this.body += level.idx + ',';
    this.body += escapeCSV(level.title) + ',';
    this.body += escapeCSV(data) + '\n';
  }

  /**
   * Trigger download of the CSV
   * @param boolean hasErr
   */
  end(hasErr) {
    if(!hasErr) {
      download(this.getFilename(), this.body);
    }
  }
}

//+--------------------------------------------------------
//|
//| EXPORT IN-MEMORY
//|
//+--------------------------------------------------------

class ExportInMemory {

  /**
   * Entrypoint
   */
  constructor() {
    var container    = document.getElementById('spreadsheet'),
        body         = container.querySelector('tbody'),
        filename     = body.dataset.file;

    var extraHeaders = this.decodeExtraHeaders(body.dataset.extraHeaders),
        headers      = Array.from(container.querySelector('thead tr').children)
                            .map(node => node.innerText);

    var csv = this.getHeaders(headers, extraHeaders)
            + '\n'
            + this.getData(body, headers, extraHeaders);

    download(filename || ('Memrise-' + idCourse + '.csv'), csv);
  }

  /**
   * @param array headers
   * @param array extraHeaders
   * @return string
   */
  getHeaders(_headers, extraHeaders) {
    var headers = [..._headers];

    var k = headers.indexOf('Score');
    if(k != -1) {
      headers.splice(k, 1, ...['Correct', 'Attempts', 'Score %']);
    }
    k = headers.indexOf('More');
    if(k != -1) {
      headers.splice(k, 1, ...extraHeaders);
    }
    k = headers.indexOf('Content');
    if(k != -1) {
      headers.splice(k, 1, ...['Title', 'Content']);
    }
    return headers.map(label => escapeCSV(label)).join(',');
  }

  /**
   * Retrieve the JSON-decoded list of extra headers
   * Or an empty list
   *
   * @param string|undefined data
   * @return array
   */
  decodeExtraHeaders(data) {
    return typeof data == 'undefined' ? [] : JSON.parse(data);
  }

  /**
   * Retrieve the rendered table as a CSV string
   * @param DOMElement body
   * @return string
   */
  getData(body, headers, extraHeaders) {
    var csv = '';

    for(let i=0; i<body.children.length; i++) {
      let tr    = body.children[i],
          data  = [];

      let k = 0;
      for(let j=0; j<headers.length; j++) {
        let label = headers[j],
            td    = tr.children[k];

        switch(label) {
           case 'Level':
           case '#':
             csv += td.innerText + ',';
             break;

           case 'Score':
             if(!td.hasAttribute('colspan')) {
                let correct = parseInt(td.innerText, 10),
                    attempt = parseInt(tr.children[k+1].innerText, 10);
                k++;

                csv += correct + ',';
                csv += attempt + ',';
                csv += parseInt(correct/attempt * 100);
              } else {
                csv += ',,';
              }

              break;

            case 'More':
              let more  = td.querySelectorAll('.more'),
                  extra = {};

              // Retrieve all additionnal that have been defined
              for(let j2=0; j2<more.length; j2++) {
                let label   = more[j2].firstElementChild.innerText,
                    content = this.getValue(more[j2].lastElementChild);

                 extra[label] = escapeCSV(content);
              }

              // Put them in order
              for(let j2=0; j2<extraHeaders.length; j2++) {
                let label = extraHeaders[j2];

                csv += ',' + (typeof extra[label] == 'undefined' ? '' : extra[label]);
              }
              break;

          // Multimedia
          case 'Content':

            csv += escapeCSV(td.children[0].innerText.trim()) + ',';
            csv += escapeCSV(td.children[1].innerText.trim());
            break;

          default:
             csv += escapeCSV(this.getValue(td.firstElementChild, true)) + ',';
             break;
        }
        k++;
      }
      csv += '\n';
    }
    return csv;
  }

  /**
   * Retrieve the text of a DOMElement
   * @param DOMElement node
   * @param boolean siblings - [false] Return the content of siblings too
   * @return string
   */
  getValue(node, siblings=false) {
    if(["IMG", "AUDIO", "VIDEO"].indexOf(node.nodeName) != -1) {
      var links = Array.from(node.parentNode.querySelectorAll(node.nodeName))
                       .map(node => node.getAttribute('src'));
      return links.join('\n');
    } else {
      return siblings ? node.parentNode.innerText : node.innerText;
    }
  }
}

//+--------------------------------------------------------
//|
//| COMMON FONCTIONS (in-memory)
//|
//+--------------------------------------------------------

/**
 * Escape HTML
 * @param string txt
 * @return txt
 */
function escapeHTML(txt) {
  if(typeof txt != "string") {
    return "";
  }
  return txt.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * Escape text for CSV
 * Surround with quotes and escape quotes inside text
 */
function escapeCSV(txt) {
  if(typeof txt != "string") {
    return "";
  }
  return '"' + txt.replace(/"/g, '""') + '"';
}

/**
 * Trigger download of a file
 * @param string filename
 * @param string txt
 */
function download(filename, txt) {
  var blob = new Blob([txt], {type: 'text/csv'});

  if(window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);

  } else {
    var link  = window.document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

window.addEventListener('load', onLoad, false);