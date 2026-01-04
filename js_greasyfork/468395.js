
// ==UserScript==
// @name        BetterOghma
// @namespace   Violentmonkey Scripts
// @description A userscript to improve https://oghma.epcc.pt.
// @match       https://oghma.epcc.pt/*
// @version     2.0.0
// @author      undefined
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/468395/BetterOghma.user.js
// @updateURL https://update.greasyfork.org/scripts/468395/BetterOghma.meta.js
// ==/UserScript==

(function () {
'use strict';

const whiteSpaces = new RegExp(/\s/g);
const rmWhiteSpaces = str => str.toString().toLowerCase().replace(whiteSpaces, '');
function setItem(key, value) {
  if (value == undefined) {
    return;
  }
  const k = rmWhiteSpaces(key);
  const v = rmWhiteSpaces(value);
  localStorage.setItem(k, v);
}
function getItem(key, defaultValue) {
  var _localStorage$getItem;
  const k = rmWhiteSpaces(key);
  return (_localStorage$getItem = localStorage.getItem(k)) != null ? _localStorage$getItem : defaultValue;
}
function checkItem(key, value) {
  if (value == undefined) {
    return false;
  }
  const k = rmWhiteSpaces(key);
  const v = rmWhiteSpaces(value);
  return localStorage.getItem(k) === v;
}

const hide = element => element.style.display = 'none';
const grid = element => element.style.display = 'grid';
const flex = element => element.style.display = 'flex';
function get(pattern, callback) {
  const element = document.querySelector(pattern);
  if (element === null) {
    return;
  }
  callback(element);
}
function getAll(pattern, callback) {
  const element = document.querySelectorAll(pattern);
  for (const i of element) {
    callback(i);
  }
}
function getByClass(className, callback) {
  const element = document.getElementsByClassName(className);
  for (const i of element) {
    callback(i);
  }
}
function getByText(text, callback) {
  const elements = document.getElementsByTagName('*');
  for (const i of elements) {
    if (i.textContent === text) {
      callback(i);
    }
  }
}

const AVARAGE_DECIMAL_PARTS = 2;
setItem('DECREASE', getItem('DECREASE', 'true'));

function getAvarage(page) {
  let avarage = 0;
  let sumAll = 0;
  let countAll = 0;
  page.querySelectorAll('tr').forEach(tr => {
    if (tr.className != 'header') {
      var _tds$2$textContent, _tds$;
      const tds = tr.querySelectorAll('td');
      sumAll += parseInt((_tds$2$textContent = (_tds$ = tds[2]) == null ? void 0 : _tds$.textContent) != null ? _tds$2$textContent : '0', 10);
      countAll++;
    }
  });
  avarage = sumAll / countAll;
  return avarage;
}
async function getAllSubjectsFromCourse(id) {
  const couseURL = new URL(`https://oghma.epcc.pt/courses/${id}`);
  const data = {
    subjects: [],
    ids: new Map(),
    evaluations: new Map()
  };
  await fetch(couseURL).then(res => {
    if (!res.ok) {
      throw new Error( /* TODO */);
    }
    return res;
  }).then(res => res.text()).then(html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const trs = doc.querySelectorAll('tbody > tr');
    trs.forEach(tr => {
      const td = tr.querySelector('td');
      if (td === null) {
        return;
      }
      const subject = td.querySelector('a');
      if (subject === null) {
        return;
      }
      let subjectTitle = subject.textContent;
      if (subjectTitle === null) {
        return;
      }
      if (subjectTitle.endsWith(' ')) {
        subjectTitle = subjectTitle.trimEnd();
      }
      const subjectId = subject.href.split('/')[4];
      if (subjectId === undefined) {
        return;
      }
      data.ids.set(subjectTitle, subjectId);
      data.subjects.push(subjectTitle);
    });
  });
  return data;
}
async function getSubjectNyUsername(userName, subjects) {
  const newSubjects = subjects;
  for (const i of newSubjects.subjects) {
    const subjectEvaluationsURL = `https://oghma.epcc.pt/units/${newSubjects.ids.get(i)}/evaluations`;
    await fetch(subjectEvaluationsURL).then(async html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(await html.text(), 'text/html');
      const trs = doc.querySelectorAll('tbody > tr');
      trs.forEach(function (tr) {
        const tds = tr.querySelectorAll('td');
        if (tds.length > 0) {
          var _tds$2, _tds$3;
          const td1 = (_tds$2 = tds[1]) == null ? void 0 : _tds$2.textContent;
          const td2 = (_tds$3 = tds[2]) == null ? void 0 : _tds$3.textContent;
          if (td1 == undefined || td2 == undefined) {
            return;
          }
          if (td1.replace(/\s/g, '').toLowerCase() === userName.replace(/\s/g, '').toLowerCase()) {
            const evaluation = td2.split(' ')[0];
            if (typeof evaluation === 'string') {
              newSubjects.evaluations.set(i, evaluation);
            }
          }
        }
      });
    });
  }
  return newSubjects;
}

const url = new URL(window.location.href);
const segments = url.pathname.split('/');
const page = segments.at(-1);

async function evaluations () {
  if (!checkItem('lastUser', segments[4])) {
    const itemToKeep = 'decrease';
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key != itemToKeep && key != undefined) {
        localStorage.removeItem(key);
      }
    }
    setItem('lastUser', segments[4]);
  }
  get('tbody', grid);
  getAll('tr', grid);
  getAll('tr', function (element) {
    const sons = element.querySelectorAll(element.className == 'header' ? 'th' : 'td');
    for (let i = 0; i < sons.length; i++) {
      const son = sons[i];
      if (son === undefined) {
        continue;
      }
      flex(son);
      if (element.className == 'header') {
        element.style.order = '-21';
        if (i == 0) {
          son.style.gridColumn = 'span 2 / span 2';
        }
        if (i > 0) {
          son.style.justifyContent = 'end';
        }
        if (i > 2) {
          hide(son);
        }
      } else {
        if (i > 1) {
          son.style.justifyContent = 'end';
        }
        if (i == 2) {
          element.style.order = (checkItem('DECREASE', 'true') ? '-' : '') + son.textContent;
        }
        if (i > 3) {
          hide(son);
        }
      }
    }
    element.style.gridTemplateColumns = '3fr 5fr 1fr 1fr';
  });
  let subjects;
  const coursesURL = 'https://oghma.epcc.pt/users/' + segments[4] + '/subscriptions';
  let courseId = 0;
  await fetch(coursesURL).then(async html => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(await html.text(), 'text/html');
    const tr = doc.querySelector('tbody > tr');
    if (tr === null) {
      return;
    }
    const anchor = tr.querySelector('td:nth(2) a');
    if (anchor === null) {
      return;
    }
    const id = anchor.href.split('/')[4];
    if (id === undefined) {
      return;
    }
    courseId = parseInt(id, 10);
  });
  if (!checkItem('allSubjectsSet', 'true')) {
    var _document$getElements, _userh1$textContent;
    const userh1 = (_document$getElements = document.getElementsByClassName('well clearfix')[0]) == null ? void 0 : _document$getElements.querySelector('h1');
    if (userh1 == undefined) {
      return;
    }
    const smallElement = userh1.querySelector('small');
    if (smallElement === null) {
      return;
    }
    const smallText = smallElement.textContent;
    if (smallText === null) {
      return;
    }
    const userName = (_userh1$textContent = userh1.textContent) == null ? void 0 : _userh1$textContent.substring(smallText.length);
    if (userName === undefined) {
      return;
    }
    subjects = await getAllSubjectsFromCourse(courseId.toString());
    subjects = await getSubjectNyUsername(userName, subjects);
    for (let i = 0; i < subjects.subjects.length; i++) {
      const title = subjects.subjects[i];
      if (title === undefined) {
        continue;
      }
      setItem(title, getItem(title, subjects.evaluations.get(title)));
      setItem(title + '_isActived', getItem(title + '_isActived', 'true'));
    }
    setItem('allSubjectsSet', 'true');
  } else {
    subjects = await getAllSubjectsFromCourse(courseId.toString());
    subjects.evaluations = new Map();
    subjects.subjects.forEach(function (title) {
      const evaluation = getItem(title, '0');
      if (typeof evaluation === 'string') {
        subjects.evaluations.set(title, evaluation);
      }
    });
  }
  await getByClass('well clearfix', async function (element) {
    let avarageSubjectSum = 0;
    let subjectsCount = 0;
    subjects.subjects.forEach(function (title) {
      if (subjects.evaluations.get(title) != '' && checkItem(title + '_isActived', 'true')) {
        subjectsCount++;
        const evaluation = subjects.evaluations.get(title);
        if (evaluation === undefined) {
          return;
        }
        avarageSubjectSum += parseFloat(evaluation);
      }
    });
    const avarage = (avarageSubjectSum / subjectsCount).toFixed(AVARAGE_DECIMAL_PARTS);
    let averageElement = null;
    if (document.getElementById('alunoAvarageText')) {
      averageElement = document.getElementById('alunoAvarageText');
    } else {
      averageElement = document.createElement('p');
      averageElement.id = 'alunoAvarageText';
    }
    if (averageElement === null) {
      return;
    }
    averageElement.innerText = `O aluno tem uma média de ${avarage} pontos`;
    if (!document.getElementById('alunoAvarageText')) {
      element.appendChild(averageElement);
    }
  });
  getByClass('span2 sidebar', function (element) {
    if (document.getElementById('evaluationsCheckers')) return;
    const div = document.createElement('div');
    div.id = 'evaluationsCheckers';
    div.style.paddingLeft = '0.8rem';
    div.style.paddingRight = '0.8rem';
    element.appendChild(div);
    for (let i = 0; i < subjects.subjects.length; i++) {
      const title = subjects.subjects[i];
      const subjectElementDiv = document.createElement('div');
      subjectElementDiv.style.display = 'flex';
      subjectElementDiv.style.flexDirection = 'row';
      subjectElementDiv.style.alignItems = 'center';
      subjectElementDiv.style.justifyContent = 'start';
      subjectElementDiv.style.padding = '0.25rem';
      const subjectElementCheckbox = document.createElement('input');
      subjectElementCheckbox.type = 'checkbox';
      subjectElementCheckbox.id = title + '_checkbox';
      if (checkItem(title + '_isActived', 'true')) {
        subjectElementCheckbox.checked = true;
      }
      subjectElementCheckbox.onclick = function () {
        setItem(title + '_isActived', checkItem(title + '_isActived', 'true') ? 'false' : 'true');
        executeSite();
      };
      const subjectElementText = document.createElement('label');
      subjectElementText.style.fontSize = '0.8rem';
      subjectElementText.style.marginBottom = '0rem';
      subjectElementText.style.userSelect = 'none';
      subjectElementText.htmlFor = title + '_checkbox';
      if (typeof title === 'string') {
        subjectElementText.innerText = title === 'Tecnologias de Informação e Comunicação' ? 'TIC' : title;
      }
      subjectElementText.style.paddingLeft = '0.5rem';
      const subjectAvarageScore = document.createElement('span');
      if (typeof title === 'string') {
        var _subjects$evaluations;
        subjectAvarageScore.innerText = (_subjects$evaluations = subjects.evaluations.get(title)) != null ? _subjects$evaluations : NaN.toString();
      }
      subjectAvarageScore.style.paddingLeft = '0.5rem';
      subjectElementDiv.appendChild(subjectElementCheckbox);
      subjectElementDiv.appendChild(subjectElementText);
      subjectElementDiv.appendChild(subjectAvarageScore);
      div.appendChild(subjectElementDiv);
    }
  });
}

function subscriptions () {
  getByClass('student active', function (element) {
    element.querySelectorAll('a').forEach(function (a) {
      a.href += '/evaluations';
    });
  });
  getAll('.student:not(.active)', hide);
  getByClass('users-list photo', flex);
  getByClass('users-list photo', function (element) {
    element.style.flexWrap = 'wrap';
  });
  let avarageSum = 0;
  let totalStudents = 0;
  getByClass('student active', async function (element) {
    var _element$querySelecto;
    const id = (_element$querySelecto = element.querySelector('a')) == null ? void 0 : _element$querySelecto.href.split('/')[4];
    const evaluationsURL = `https://oghma.epcc.pt/users/${id}/evaluations`;
    if (id) {
      await fetch(evaluationsURL).then(async html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(await html.text(), 'text/html');
        const avarage = getAvarage(doc);
        avarageSum += avarage;
        totalStudents++;
        element.style.order = (checkItem('DECREASE', 'true') ? '-' : '') + (avarage * 1000).toFixed(0);
        const averageElement = document.createElement('p');
        averageElement.textContent = 'Média de ' + avarage.toFixed(AVARAGE_DECIMAL_PARTS) + ' pontos';
        element.appendChild(averageElement);
      });
    } else {
      const totalAvarage = avarageSum / totalStudents;
      const p = element.querySelector('p');
      if (p === null) {
        return;
      }
      p.textContent = `Média de ${totalAvarage.toFixed(AVARAGE_DECIMAL_PARTS)} pontos`;
      element.style.order = (checkItem('DECREASE', 'true') ? '-' : '') + (totalAvarage * 1000).toFixed(0);
    }
  });
  getByClass('users-list photo', function (element) {
    const avarageStudent = document.createElement('li');
    const imageA = document.createElement('a');
    const image = document.createElement('img');
    const br = document.createElement('br');
    const span = document.createElement('span');
    const a = document.createElement('a');
    const p = document.createElement('p');
    avarageStudent.className = 'student active';
    image.src = 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png';
    image.style.height = '79px';
    image.style.width = 'auto';
    span.textContent = 'Média';
    a.textContent = 'Aluno Médio';
    imageA.appendChild(image);
    avarageStudent.appendChild(imageA);
    avarageStudent.appendChild(span);
    avarageStudent.appendChild(br);
    avarageStudent.appendChild(a);
    avarageStudent.appendChild(p);
    element.appendChild(avarageStudent);
  });
}

const sites = new Map([['evaluations', evaluations], ['subscriptions', subscriptions]]);
const executeSite = () => {
  if (typeof page === 'string') {
    var _sites$get;
    (_sites$get = sites.get(page)) == null ? void 0 : _sites$get();
  }
};

getByText('Inscrições nos Exames', hide);
getByClass('events announcements', hide);
getByText('Importante!', hide);
executeSite();
getByClass('nav pull-right', element => {
  flex(element);
  element.style.alignItems = 'center';
  const li = document.createElement('li');
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  if (checkItem('DECREASE', 'true')) checkbox.checked = true;
  checkbox.onclick = function () {
    setItem('DECREASE', checkItem('DECREASE', 'true') ? 'false' : 'true');
    executeSite();
  };
  const text = document.createElement('span');
  text.textContent = 'Ordem decrescente';
  text.style.padding = '1rem';
  li.style.display = 'flex';
  li.appendChild(text);
  li.appendChild(checkbox);
  li.style.order = '-1';
  element.appendChild(li);
});

})();
