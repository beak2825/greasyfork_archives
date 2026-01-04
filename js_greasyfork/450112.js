// ==UserScript==
// @name        Thrillshare Staff List CSV
// @namespace   Thrillshare Scripts
// @include     /^https:\/\/thrillshare\.com\/s\/staff-[a-z]{3}(-middleburycsin)?$/
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @version     1.0
// @author      Ira Pearson
// @description 8/1/2022, 4:06:17 PM
// @downloadURL https://update.greasyfork.org/scripts/450112/Thrillshare%20Staff%20List%20CSV.user.js
// @updateURL https://update.greasyfork.org/scripts/450112/Thrillshare%20Staff%20List%20CSV.meta.js
// ==/UserScript==

/*jshint esversion: 8 */

const parser = new DOMParser();

const fetchURL = async function(url) {
	const response = await fetch(url);
	const text = await response.text();
	return parser.parseFromString(text, 'text/html');
};

const objectsToCSV = function(arr=[]) {
	const array = [Object.keys(arr[0])].concat(arr);
	return array.map(row => {
		return Object.values(row).map(value => {
			return typeof value === 'string' ? JSON.stringify(value) : value;
		}).toString();
	}).join('\n');
};

// csvStringToArray function from https://gist.github.com/plbowers/7560ae793613ee839151624182133159
// Unable to find it in a library so I am providing it inline here.
const csvStringToArray = (strData, header=true) => {
  const objPattern = new RegExp(("(\\,|\\r?\\n|\\r|^)(?:\"((?:\\\\.|\"\"|[^\\\\\"])*)\"|([^\\,\"\\r\\n]*))"),"gi");
    let arrMatches = null, arrData = [[]];
    while (arrMatches = objPattern.exec(strData)){
        if (arrMatches[1].length && arrMatches[1] !== ",") arrData.push([]);
        arrData[arrData.length - 1].push(arrMatches[2] ? 
            arrMatches[2].replace(new RegExp( "[\\\\\"](.)", "g" ), '$1') :
            arrMatches[3]);
    }
    if (header) {
        hData = arrData.shift();
        hashData = arrData.map(row => {
            let i = 0;
            return hData.reduce(
                (acc, key) => { 
                    acc[key] = row[i++]; 
                    return acc; 
                },
                {}
            );
        });
        return hashData;
    } else {
        return arrData;
    }
};

const getStaffList = function(data) {
	return [...data.querySelectorAll('div.staff-list div.row:not(.head)')].map(row => {
		return {
			id: row.id.split('_')[1],
			name: row.querySelector('span.name > strong').innerText,
			title: row.querySelector('div.title-span > span').innerText,
			email: row.querySelector('span.email').innerText,
		};
	});
};

const downloadCSV = function(data) {
	window.open('data:text/csv;charset=utf-8,' + encodeURI(objectsToCSV(data)));
};

const downloadLink = function(event) {
  event.preventDefault();
  fetchURL(location.href).then(getStaffList).then(downloadCSV);
};

VM.observe(document.body, () => {

  const staffList = document.querySelector('div.staff-container');

  if(staffList) {

    const container = {
      div: VM.hm('div', {
        style: 'padding: 10px; border: 2px dashed black; margin: 20px 0;',
      }),
      h1: VM.hm('h1', {}, 'Customizations'),
    };
    
    container.div.append(container.h1);
    staffList.after(container.div);
    
    const btn = VM.hm('a', {
      href: location.href + '/download',
      class: 'reskin-btn',
    }, 'Download CSV');
    btn.addEventListener('click', downloadLink);
    container.div.append(btn);
  
    const departments = [...document.querySelectorAll('div#create_contact input[type=checkbox][name="directory[section_filter_ids][]"]')]
      .reduce((p,c) => {p[c.nextElementSibling.innerText] = c.value; return p;}, {});
    
    if(departments) {

      const updateDepartments = {
        form: VM.hm('form', {style: 'margin-top: 20px'}),
        p: VM.hm('p'),
        label: VM.hm('label', {
          for: 'departments_file_upload',
        }, 'Upload Departments: '),
        input: VM.hm('input', {
          type: 'file',
          name: 'file',
          id: 'departments_file_upload',
          onchange: function() {
            this.files[0].text().then(data => {
              for(let row of csvStringToArray(data, false)) {
                fetchURL(location.href + '/directory/' + row[0] + '/edit').then(results => {
                  const form = results.querySelector('form#edit_directory_' + row[0]);
                  const formData = new FormData(form);
                  formData.delete('directory[section_filter_ids][]');
                  for(let department of row[1].split(',').map(e => departments[e]))
                    formData.append('directory[section_filter_ids][]', department);
                  fetch(form.action, {method: 'post', body: formData});
                });
              }
            });
          },
        }, 'Browse'),
      };
      
      updateDepartments.p.append(updateDepartments.label);
      updateDepartments.p.append(updateDepartments.input);
      updateDepartments.form.append(updateDepartments.p);
      container.div.append(updateDepartments.form);

      const updateURLS = {
        form: VM.hm('form', {style: 'margin-top: 20px'}),
        p: VM.hm('p'),
        label: VM.hm('label', {
          for: 'urls_file_upload',
        }, 'Upload Website URLs: '),
        input: VM.hm('input', {
          type: 'file',
          name: 'file',
          id: 'urls_file_upload',
          onchange: function() {
            this.files[0].text().then(data => {
              for(let row of csvStringToArray(data, false)) {
                if(row[0] != '' && row[1] != '') {
                  fetchURL(location.href + '/directory/' + row[0] + '/edit').then(results => {
                    const form = results.querySelector('form#edit_directory_' + row[0]);
                    const formData = new FormData(form);
                    formData.set('directory[class_link]', row[1]);
                    fetch(form.action, {method: 'post', body: formData});
                  });
                }
              }
            });
          },
        }, 'Browse'),
      };
      
      updateURLS.p.append(updateURLS.label);
      updateURLS.p.append(updateURLS.input);
      updateURLS.form.append(updateURLS.p);
      container.div.append(updateURLS.form);

    }

    return true;

  }

});
