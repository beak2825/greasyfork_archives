// ==UserScript==
// @name         NetLife admin helper
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Simplifies user's experience
// @author       mentor-27
// @license      Apache2.0
// @website      https://github.com/mentor-27
// @match        https://order.nicesmile.co.uk/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nicesmile.co.uk
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/479485/NetLife%20admin%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/479485/NetLife%20admin%20helper.meta.js
// ==/UserScript==

const mainUrl = new URL(location.href);

//#region globalStyles
let allOverStyle = `
        #sidebar a {
            transition: width 0.2s;
        }
        #body a,
        form a {
            position: relative;
            text-decoration: none;
        }
        #body a:hover,
        form a:hover {
            background-color: transparent;
        }
        #body a::before,
        form a::before {
            content: '';
            position: absolute;
            display: inline-block;
            height: 2px;
            background: #0088d1;
            width: 0;
            transition: 0.3s;
            right: 0;
            bottom: -1px;
        }
        #body a:hover::before,
        form a:hover::before {
            width: 100%;
            left: 0;
        }
`;

window.addEventListener('load', () => {
  if (mainUrl.pathname == '/admin/prophoto/jobs') ncu_filterJobsList();
  else if (mainUrl.pathname == '/admin/prophoto/jobs/edit.php')
    ncu_editPageFormat();
  else if (mainUrl.pathname == '/admin/prophoto/jobs/shootreport.php')
    ncu_codesFormat();
  else if (mainUrl.pathname == '/admin/prophoto/jobs/subject.php')
    ncu_subjectFormat();
  else {
    document.body.insertAdjacentHTML(
      'beforeend',
      `
<style>
    ${allOverStyle}
</style>
`
    );
  }
});

//#region jobsListFilter
function ncu_filterJobsList() {
  const searchQueryBlock = document.querySelector('.jss13');
  const fastFilterInput = document.createElement('input');
  fastFilterInput.id = 'fastFilter';
  fastFilterInput.type = 'text';
  fastFilterInput.setAttribute('placeholder', 'Fast filter');
  let list = [];
  searchQueryBlock.classList.add('flex-col');
  searchQueryBlock.insertAdjacentElement('afterbegin', fastFilterInput);
  fastFilterInput.addEventListener('click', () => {
    list = document.querySelectorAll('.ReactVirtualized__Table__row');
  });
  fastFilterInput.oninput = () => {
    let regexp = new RegExp(fastFilterInput.value, 'gi');
    for (let item of list) {
      if (
        fastFilterInput.value != '' &&
        !item.childNodes[1].firstChild.firstChild.textContent.match(regexp)
      )
        item.style.display = 'none';
      else {
        item.style.display = 'flex';
        item.style.position = 'initial';
      }
    }
  };
  document.body.insertAdjacentHTML(
    'beforeend',
    `
<style>
    ${allOverStyle}
    #fastFilter {
        outline: none;
        margin-top: 4px;
        padding: 4px 8px;
        border-radius: 8px;
        border: solid 1px #888;
        background: linear-gradient(to right, #ddd, #fff);
    }
    .flex-col {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
</style>
`
  );
}

//#region editPage
function ncu_editPageFormat() {
  window.onload = () => window.scrollTo(0, 0);
  const menuItems = [...document.querySelectorAll('.rightcolumn li')];
  const filteredItems = menuItems.filter(item => !item.classList.length);
  filteredItems.forEach(item => {
    item.classList.add('sbItem');
    switch (item.children[0].children[0].textContent) {
      case 'assignment_ind':
        item.classList.add('red');
        break;
      case 'picture_as_pdf':
        item.classList.add('green');
        break;
      case 'receipt_long':
        item.classList.add('orange');
        break;
      default:
        break;
    }
  });
  document.body.insertAdjacentHTML(
    'beforeend',
    `
    <style>
        #sidebar a {
            transition: 0.2s;
        }
        #body a,
        form a {
            position: relative;
            text-decoration: none;
        }
        #body a:hover,
        form a:hover {
            background-color: transparent;
        }
        #body a::before,
        form a::before {
            content: '';
            position: absolute;
            display: inline-block;
            height: 0;
            background: #0088d1;
            width: 4px;
            transition: 0.3s;
            left: -4px;
            right: 0;
            bottom: 0;
        }
        #body a:hover::before,
        form a:hover::before {
            height: 100%;
            top: 0;
        }
        #body a::after,
        form a::after {
            content: '';
            position: absolute;
            display: inline-block;
            height: 2px;
            background: #0088d1;
            width: 0;
            transition: width 0.4s 0.3s;
            right: 0;
            bottom: -2px;
        }
        #body a:hover::after,
        form a:hover::after {
            width: calc(100% + 4px);
            left: -4px;
        }
        
        .sbItem {
            background: #eee;
            border-radius: 4px;
            padding: 4px 8px;

            & a {
              display: inline-block;
            }
        }

        .sbItem.red {
            color: #c44;

            & a::before, a::after {
                background: #c44 !important;
            }
        }

        .sbItem.green {
            color: #484;

            & a::before, a::after {
                background: #484 !important;
            }
        }

        .sbItem.orange {
            color: #d84;

            & a::before, a::after {
                background: #d84 !important;
            }
        }
    </style>
    `
  );
}

function ncu_codesFormat() {
  document.querySelector('.singleolumn > h3').style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;
  const filterField = document.createElement('input');
  filterField.id = 'nmu_filter_field';
  filterField.type = 'text';
  filterField.placeholder = 'Filter';
  document
    .querySelector('#subject_filter')
    .insertAdjacentHTML(
      'beforebegin',
      '<div><label for="nmu_filter_field">Filter by Subject name:</label></div>'
    );
  document
    .querySelector('.singleolumn > h3 > div')
    .insertAdjacentElement('beforeend', filterField);
  const name_tds = document.querySelectorAll(
    'tr:nth-child(n + 3):nth-last-child(n + 2) > td:first-child'
  );
  filterField.oninput = () => {
    let regexp = new RegExp(filterField.value, 'gi');
    for (let item of name_tds) {
      if (filterField.value != '' && !item.textContent.match(regexp))
        item.parentNode.style.display = 'none';
      else item.parentNode.removeAttribute('style');
    }
  };
  document.querySelector('#body').style.width = '65%';
  document.querySelector('table th:last-child').style.textAlign = 'center';
  let code_tds = document.querySelectorAll('td[align]');
  let codesList = [];
  code_tds.forEach((item, i) => {
    item.setAttribute('width', '200');
    codesList[i] = item.textContent.match(/[a-z0-9]+/gi);
    item.innerHTML = `<ul></ul>`;
    for (let j in codesList[i])
      item.children[0].insertAdjacentHTML(
        'beforeend',
        `<li title="Click to copy">${codesList[i][j].toUpperCase()}</li>`
      );
  });
  let lis = document.querySelectorAll('li');
  lis.forEach(li => {
    li.onclick = function (e) {
      navigator.clipboard.writeText(li.textContent);
      this.classList.add('copied');
      setTimeout(() => {
        this.classList.remove('copied');
      }, 490);
    };
  });
  document.body.insertAdjacentHTML(
    'beforeend',
    `
    <style>
        ${allOverStyle}
        #nmu_filter_field {
            margin: 0 0 0 10px;
        }
        ul {
            padding: 0;
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 3px;
        }
        li {
            position: relative;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            list-style: none;
            cursor: pointer;
            padding: 5px 3px 3px;
            background: #eee;
            width: 80px;
            height: 22px;
            border: 1px solid #ddd;
            border-radius: 5px;
            color: #888;
            transition: 0.2s;
            letter-spacing: 1px;
            font-weight: 600;
            font-family: 'Roboto', sans-serif;
        }
        li:last-child {
            background: #ddffee;
            color: #444;
        }
        li:hover {
            background: #ddeeff;
            color: #000;
        }
        li > span {
            position: absolute;
            transform: translate(-50%, -50%);

            border-radius: 50%;
            animation: animate 0.5s linear infinite;
        }
        @keyframes animate {
            0% {
                background: #000;
                width: 0;
                height: 0;
            }
            100% {
                background: transparent;
                width: 200px;
                height: 200px;
            }
        }
        li::before {
            content: 'Copied';
            border: 1px solid #ddd;
            position: absolute;
            padding: 5px;
            background: #eee;
            color: #444;
            border-radius: 5px;
            transform-origin: top left;
            transition: 0.25s;
            top: 0;
            opacity: 0;
            z-index: -1;
        }
        li.copied:nth-child(-n + 3):before {
            z-index: -1;
            transform: translateY(-17px) rotate(-10deg);
            opacity: 1;
        }
        li.copied:nth-child(n + 4):before {
            z-index: 1;
            transform: translateY(-17px) rotate(-10deg);
            opacity: 1;
        }
        table tr > td:first-child {
            width: fit-content;
        }
        #nmu_filter_field {
            display: inline-block;
            background: linear-gradient(to right, #eee, transparent);
            border-style: solid;
            border-top: none;
            border-right: none;
            border-color: #ccc;
            border-radius: 0 0 0 10px;
            padding: 5px 10px !important;
            outline: none;
            min-height: 10px !important;
            height: 15px !important;
        }
        #nmu_filter_field::placeholder {
            opacity: 1;
            color: #aaa;
            transition: 0.3s;
        }
        #nmu_filter_field:focus::placeholder {
            opacity: 0;
        }
    </style>
    `
  );
}

function ncu_subjectFormat() {
  let links = document.querySelectorAll(
    'table:last-of-type tr:nth-child(n + 2):nth-child(n) td:nth-child(2) a:first-child'
  );
  let cells = document.querySelectorAll(
    'table:last-of-type tr:nth-child(n + 2):nth-child(n) td:nth-child(2)'
  );
  cells.forEach(cell => {
    cell.style.display = 'flex';
    cell.style.flexDirection = 'row';
  });
  links.forEach(item => {
    item.classList.add('formattedLink');
    item.textContent = item.textContent.toUpperCase();
    item.insertAdjacentHTML(
      'afterend',
      `
        <div class="copyButton" title="Copy code">
            <svg width="20px" height="20px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" fill="#000000">
                <rect x="128" y="128" width="336" height="336" rx="57" ry="57" style="fill:none;stroke:#888;stroke-linejoin:round;stroke-width:48px"></rect>
                <path d="M383.5,128l.5-24a56.16,56.16,0,0,0-56-56H112a64.19,64.19,0,0,0-64,64V328a56.16,56.16,0,0,0,56,56h24" style="fill:none;stroke:#888;stroke-linecap:round;stroke-linejoin:round;stroke-width:48px"></path>
            </svg>
        </div>
        `
    );
  });
  const copyButtons = document.querySelectorAll('.copyButton');
  copyButtons.forEach(copyButton =>
    copyButton.addEventListener('click', e =>
      navigator.clipboard.writeText(
        e.currentTarget.previousElementSibling.textContent
      )
    )
  );
  document.body.insertAdjacentHTML(
    'beforeend',
    `
        <style>
            ${allOverStyle}
            .formattedLink {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;
                list-style: none;
                cursor: pointer;
                padding: 3px;
                background: #eee;
                width: 80px;
                height: 22px;
                border: 1px solid #ddd;
                border-radius: 5px;
                color: #888;
                letter-spacing: 1px;
                transition: 0.2s;
                overflow: hidden;
                letter-spacing: 1px;
                font-weight: 600;
                font-family: 'Roboto', sans-serif;
            }

            .formattedLink:visited {
                color: #888;
            }
            .formattedLink:hover {
                background: #ddeeff !important;
                color: #000;
            }
            .copyButton {
                display: flex;
                margin-left: 8px;
                cursor: pointer;
                align-items: center;
                background: #eee;
                border: solid 1px #ddd;
                border-radius: 5px;
                padding-inline: 4px;
                transition: 0.15s;
            }
            .copyButton:hover {
                background: #ddeeff;
            }
            .copyButton:active {
                background: #888;
            }
            .copyButton:active svg path,
            .copyButton:active svg rect {
                stroke: #eee !important;
            }
            </style>
    `
  );
}
