// ==UserScript==
// @name Hide Mandiner User
// @name:hu Mandiner Hozzászóló Elrejtő
// @description	Userscript for hiding mandiner.hu's users
// @description:hu	Felhasználói szkript a mandiner.hu felhasználóinak elrejtéséhez
// @icon	https://mandiner.hu/images/favicon.png
// @version	5.0
// @license MIT
// @include	https://*mandiner.hu/cikk/*
// @grant	 none
// @namespace https://greasyfork.org/users/412587
// @downloadURL https://update.greasyfork.org/scripts/443749/Hide%20Mandiner%20User.user.js
// @updateURL https://update.greasyfork.org/scripts/443749/Hide%20Mandiner%20User.meta.js
// ==/UserScript==
let comments = document.querySelectorAll('.comment'),
	disabledUsers = window.localStorage.getItem('disabledUsers') === null ? [] : JSON.parse(window.localStorage.getItem('disabledUsers')),
  hideDisabledUsers = window.localStorage.getItem('hideDisabledUsers') === null ? 'false' : window.localStorage.getItem('hideDisabledUsers'),
  commentsHead = document.querySelector('.comments-head'),
  headerDisabledUsers = document.createElement('h5'),
  searchBox = document.createElement('div'),
  searchHeader = document.createElement('div'),
  searchContent = document.createElement('div'),
  searchField = document.createElement('input'),
  searchButton = document.createElement('button'),
  searchBreak = document.createElement('br'),
  resultField = document.createElement('textarea'),
  searchFooter = document.createElement('div'),
  addUsersButton = document.createElement('button'),
  buttonImportUsers = document.createElement('button');
console.log('Comments: ' + comments.length);
console.log('Disabled users: ' + disabledUsers.length);

headerDisabledUsers.innerText = '▼ Némított felhasználók';
headerDisabledUsers.style.cursor = 'pointer';
buttonImportUsers.style.padding = '0.25em';
buttonImportUsers.style.margin = '0.25em';
buttonImportUsers.style.backgroundColor = '#517491';
buttonImportUsers.style.color = '#fff';
buttonImportUsers.style.fontWeight = 'bold';
buttonImportUsers.innerText = '📂 Importálás';

searchBox.setAttribute('id', 'searchBox');
searchBox.style.border = '1px solid #000';
searchBox.style.margin = '0.25em';
searchBox.style.width = 'fit-content';

searchHeader.setAttribute('id', 'searchHeader');
searchHeader.innerText = '▶ Tömeges felhasználó tiltás';
searchHeader.style.borderBottom = '1px solid #000';
searchHeader.style.padding = '0.25em';
searchHeader.style.cursor = 'pointer';
searchHeader.onclick = () => {
  if (searchContent.style.display == 'none') {
    searchContent.style.display = 'block';
    searchFooter.style.display = 'block';
    searchHeader.innerText = searchHeader.innerText.replace('▶', '▼');
  } else {
    searchContent.style.display = 'none';
    searchFooter.style.display = 'none';
    searchHeader.innerText = searchHeader.innerText.replace('▼', '▶');
  }
};

searchContent.setAttribute('id', 'searchContent');
searchContent.style.padding = '0.25em';
searchContent.style.display = 'none';
searchField.setAttribute('id', 'searchField');
searchField.setAttribute('placeholder','Felhasználónév-részlet');
searchField.style.border = '1px solid #000';
searchButton.innerText = '🔎';
searchButton.setAttribute('title', 'Felhasználó keresése')
searchButton.style.padding = '0 0.25em';
searchButton.style.marginLeft = '0.25em';
searchButton.style.backgroundColor = '#517491';
resultField.style.marginTop = '0.25em';
resultField.setAttribute('rows','5');
resultField.setAttribute('placeholder','Talált felhasználók');
resultField.style.border = '1px solid #000';
searchContent.appendChild(searchField);
searchContent.appendChild(searchButton);
searchContent.appendChild(searchBreak);
searchContent.appendChild(resultField);

searchButton.onclick = () => {
  let searchUser = searchField.value,
      searchUserRegexp = new RegExp(searchUser, 'gi'),
      users = [];
  resultField.innerHTML = '';

  for (let comment of comments) {
		let user = comment.querySelector('.commentuser').text;
    if (user != null || user != undefined) {
	    users.push(user);
    }
  }
  users = [...new Set(users)].filter((v)=>v.match(searchUserRegexp));
  for (let user of users) {
    resultField.innerHTML += user + '\n';
  }
  addUsersButton.removeAttribute('disabled');
};

searchFooter.setAttribute('id', 'searchFooter');
searchFooter.style.borderTop = '1px solid #000';
searchFooter.style.display = 'none';
addUsersButton.innerText = '👥 Felhasználók tiltása';
addUsersButton.style.padding = '0.25em';
addUsersButton.style.margin = '0.25em';
addUsersButton.style.backgroundColor = '#517491';
addUsersButton.style.color = '#fff';
addUsersButton.style.fontWeight = 'bold';
addUsersButton.setAttribute('disabled', 'disabled');
searchFooter.appendChild(addUsersButton);

addUsersButton.onclick = () => {
  let users = resultField.innerHTML.split('\n').filter((v) => v != '');
  users = [...new Set(users)]
  if (users.length !== 0) {
    for (let user of users) {
      if (user != '' && (disabledUsers.length == 0 || !disabledUsers.includes(user))) {
        disabledUsers.push(user);
      }
  	}
    window.localStorage.setItem('disabledUsers', JSON.stringify(disabledUsers));
    window.location.reload(true);
  }
};

searchBox.appendChild(searchHeader);
searchBox.appendChild(searchContent);
searchBox.appendChild(searchFooter);

commentsHead.appendChild(headerDisabledUsers);
commentsHead.appendChild(searchBox);
commentsHead.appendChild(buttonImportUsers);

buttonImportUsers.onclick = () => {
  let fileInput = document.createElement('input');
  fileInput.setAttribute('type', 'file');
  fileInput.setAttribute('accept', '.txt');
  fileInput.onchange = () => {
    let reader = new FileReader(),
    		file = fileInput.files[0];
   	reader.onload = (event) => {
      let newUsers = event.target.result.split('\n');
      if (newUsers.length !== 0) {
        for (let newUser of newUsers) {
          if (newUser != '' && (disabledUsers.length == 0 || !disabledUsers.includes(newUser))) {
            disabledUsers.push(newUser);
          }
        }
        window.localStorage.setItem('disabledUsers', JSON.stringify(disabledUsers));
        window.location.reload(true);
      }
    };
    reader.readAsText(file);
  };
  fileInput.click();
};

if (disabledUsers.length > 0) {
	let commentsHead = document.querySelector('.comments-head'),
		listDisabledUsers = document.createElement('ul'),
    buttonExportUsers = document.createElement('button'),
	  buttonClearUsers = document.createElement('button');
	if (hideDisabledUsers === 'true') {
    listDisabledUsers.setAttribute('style', 'display: none;');
    headerDisabledUsers.innerText = headerDisabledUsers.innerText.replace('▼', '▶');
  } else {
    listDisabledUsers.removeAttribute('style');
    headerDisabledUsers.innerText = headerDisabledUsers.innerText.replace('▶', '▼');
  }
  headerDisabledUsers.onclick = () => {
    if (listDisabledUsers.hasAttribute('style')) {
	    listDisabledUsers.removeAttribute('style');
  	  headerDisabledUsers.innerText = headerDisabledUsers.innerText.replace('▶', '▼');
      window.localStorage.setItem('hideDisabledUsers', 'false');
    } else {
      listDisabledUsers.setAttribute('style', 'display: none;');
      headerDisabledUsers.innerText = headerDisabledUsers.innerText.replace('▼', '▶');
      window.localStorage.setItem('hideDisabledUsers', 'true');
    }
  };
  buttonClearUsers.innerText = '✓ Összes felhasználó engedélyezése';
	buttonClearUsers.style.padding = '0.25em';
	buttonClearUsers.style.margin = '0.25em';
  buttonClearUsers.style.backgroundColor = '#070';
  buttonClearUsers.style.color = '#fff';
  buttonClearUsers.style.fontWeight = 'bold';
	buttonExportUsers.style.padding = '0.25em';
  buttonExportUsers.style.margin = '0.25em';
  buttonExportUsers.style.backgroundColor = '#517491';
  buttonExportUsers.style.color = '#fff';
  buttonExportUsers.style.fontWeight = 'bold';
	buttonExportUsers.innerText = '💾 Exportálás';
	for (let disabledUser of disabledUsers) {
		let listItemDisabledUser = document.createElement('li'),
			spanDisabledUser = document.createElement('span'),
			buttonEnableUser = document.createElement('button');
		spanDisabledUser.innerText = disabledUser;
		buttonEnableUser.setAttribute('data-username',disabledUser);
		buttonEnableUser.innerText = '✓';
		buttonEnableUser.setAttribute('title', 'Engedélyezés');
		buttonEnableUser.style.border = '1px solid #fff';
		buttonEnableUser.style.backgroundColor = '#070';
		buttonEnableUser.style.color = '#fff';
		buttonEnableUser.style.padding = '0.25em';
		buttonEnableUser.style.margin = '0 0.25em';
		buttonEnableUser.style.fontWeight = 'bold';
		buttonEnableUser.onclick = () => {
			let userName = buttonEnableUser.getAttribute('data-username');
			disabledUsers = disabledUsers.filter(item => item !== userName);
			window.localStorage.setItem('disabledUsers', JSON.stringify(disabledUsers));
			window.location.reload(true);
		};
		listItemDisabledUser.appendChild(spanDisabledUser);
		listItemDisabledUser.appendChild(buttonEnableUser);
		listDisabledUsers.appendChild(listItemDisabledUser);
	}
  buttonExportUsers.onclick = () => {
    if (disabledUsers.length > 0) {
      let users = disabledUsers.join('\n'),
          downloadLink = document.createElement('a');
      downloadLink.setAttribute(
        'href',
        window.URL.createObjectURL(
          new Blob(
            [users],
            {type: 'text/plain'}
          )
        )
      );
      downloadLink.setAttribute('download', 'users.txt');
      downloadLink.click();
    }
  };
  buttonClearUsers.onclick = () => {
    disabledUsers = [];
    window.localStorage.setItem('disabledUsers', JSON.stringify(disabledUsers));
    window.location.reload(true);
  };
  commentsHead.appendChild(buttonExportUsers);
	commentsHead.appendChild(buttonClearUsers);
	commentsHead.appendChild(listDisabledUsers);
}

for (let comment of comments) {
	let user = comment.querySelector('.commentuser'),
		buttonDisableUser = document.createElement('button');
  if (user != null || user != undefined) {
    if (disabledUsers.includes(user.text)) {
      comment.style.display = 'none';
      comment.style.visibility = 'hidden';
    }
    buttonDisableUser.innerText = 'X';
    buttonDisableUser.setAttribute('title', 'Tiltás');
    buttonDisableUser.style.border = '1px solid #fff';
    buttonDisableUser.style.backgroundColor = '#f00';
    buttonDisableUser.style.color = '#fff';
    buttonDisableUser.style.padding = '0.25em';
    buttonDisableUser.style.margin = '0 0.25em';
    buttonDisableUser.style.fontWeight = 'bold';
    buttonDisableUser.setAttribute('data-username', user.text);

    buttonDisableUser.onclick = () => {
      let userName = buttonDisableUser.getAttribute('data-username');
      if (
        disabledUsers.length == 0 ||
        !disabledUsers.includes(userName)
      ) {
        disabledUsers.push(userName);
        window.localStorage.setItem('disabledUsers', JSON.stringify(disabledUsers));
      }
      window.location.reload(true);
    };
    user.after(buttonDisableUser);
  }
}