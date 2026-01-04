
// ==UserScript==
// @name        BetterOghma
// @namespace   Violentmonkey Scripts
// @description This is a userscript.
// @match       https://oghma.epcc.pt/*
// @version     2.0.0
// @author      Leonardo
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @require     https://cdn.jsdelivr.net/npm/@violentmonkey/dom@2
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/468146/BetterOghma.user.js
// @updateURL https://update.greasyfork.org/scripts/468146/BetterOghma.meta.js
// ==/UserScript==

(function () {
'use strict';

var css_248z = "";

// global CSS
document.head.append(VM.m(VM.h("style", null, css_248z)));

// CSS modules

class LocalStorage {
  set(key, value) {
    key = key.toString().toLowerCase().replace(/\s/g, "");
    value = value.toString();
    localStorage.setItem(key, value);
  }
  get(key, defaultValue = "") {
    var _localStorage$getItem;
    key = key.toString().toLowerCase().replace(/\s/g, "");
    return (_localStorage$getItem = localStorage.getItem(key)) != null ? _localStorage$getItem : defaultValue;
  }
  check(key, value) {
    key = key.toString().toLowerCase().replace(/\s/g, "");
    value = value.toString();
    return localStorage.getItem(key) == value;
  }
}

class MainController {
  constructor(url) {
    this.AVARAGE_DECIMAL_PARTS = 2;
    this.hide = function (element) {
      element.style.display = "none";
    };
    this.grid = function (element) {
      element.style.display = "grid";
    };
    this.flex = function (element) {
      element.style.display = "flex";
    };
    this.url = url;
    this.storage = new LocalStorage();
    this.getByText("Inscrições nos Exames", this.hide);
    this.getByClass("events announcements", this.hide);
    this.getByText("Importante!", this.hide);
  }
  async get(pattern, callback) {
    let element = document.querySelector(pattern);
    if (!element) return;
    callback(element);
  }
  async getAll(pattern, callback) {
    let element = document.querySelectorAll(pattern);
    if (!element) return;
    for (var i = 0; i < element.length; i++) callback(element[i]);
  }
  async getByClass(className, callback) {
    let element = document.getElementsByClassName(className);
    if (!element) return;
    for (var i = 0; i < element.length; i++) await callback(element[i]);
  }
  async getByText(text, callback) {
    var elements = document.getElementsByTagName("*");
    for (var i = 0; i < elements.length; i++) if (elements[i].textContent === text) callback(elements[i]);
  }
  setDecrescent() {
    this.getByClass("nav pull-right", element => {
      element.style.display = "flex";
      element.style.alignItems = "center";
    });
    this.getByClass("nav pull-right", element => {
      if (document.querySelector("#decrease")) return;
      const Checkbox = () => VM.h("input", {
        id: "decrease",
        type: "checkbox",
        checked: this.storage.check("DECREASE", "true"),
        onclick: () => {
          this.storage.set('DECREASE', this.storage.check("DECREASE", "true") ? "false" : "true");
          this.index();
        }
      });
      const Text = () => VM.h("span", {
        style: "padding: 1rem;"
      }, "Ordem decrescente");
      const Li = () => VM.h("li", {
        style: "display: flex; order: -1"
      }, VM.h(Text, null), VM.h(Checkbox, null));
      element.append(VM.m(VM.h(Li, null)));
    });
  }
}

class Subject {
  setName(name) {
    this.name = name;
  }
  setId(id) {
    this.id = id;
  }
  setEvaluation(evaluation) {
    this.evaluation = evaluation;
  }
  getName() {
    return this.name;
  }
  getId() {
    return this.id;
  }
  getEvaluation() {
    return this.evaluation;
  }
}

class Evaluations extends MainController {
  async index() {
    this.setDecrescent();
    this.subjects = [];

    // Verifica em qual user está salvo a atual data
    if (!this.storage.check("lastUser", this.url[4])) {
      const itemToKeep = "decrease";
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key != itemToKeep) {
          localStorage.removeItem(key);
        }
      }
      this.storage.set("lastUser", this.url[4]);
    }

    // CSS
    this.get("tbody", this.grid);
    this.getAll("tr", this.grid);
    this.getAll("tr", element => {
      let sons = element.querySelectorAll(element.className == "header" ? "th" : "td");
      for (var i = 0; i < sons.length; i++) {
        sons[i].style.display = "flex";
        if (element.className == "header") {
          element.style.order = '-21';
          if (i == 0) sons[i].style.gridColumn = "span 2 / span 2";
          if (i > 0) sons[i].style.justifyContent = "end";
          if (i > 2) this.hide(sons[i]);
        } else {
          if (i > 1) sons[i].style.justifyContent = "end";
          if (i == 2) element.style.order = (this.storage.check("DECREASE", "true") ? '-' : '') + sons[i].textContent;
          if (i > 3) this.hide(sons[i]);
        }
      }
      element.style.gridTemplateColumns = "30% 50% 10% 10%";
    });

    // Pega o id do curso
    let coursesURL = "https://oghma.epcc.pt/users/" + this.url[4] + "/subscriptions";
    let courseId;
    await fetch(coursesURL).then(async html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(await html.text(), 'text/html');
      let tr = doc.querySelector("tbody > tr");
      courseId = tr.querySelectorAll("td")[1].querySelector("a").href.split("/")[4];
    });

    // Salva todas as notas
    if (!this.storage.check("allSubjectsSet", "true")) {
      let userh1 = document.getElementsByClassName("well clearfix")[0].querySelector("h1");
      var smallElement = userh1.querySelector('small');
      var smallText = smallElement.textContent;
      let username = userh1.textContent.substring(smallText.length);
      let allSubjects = await this.getAllSubjectsFromCourse(courseId);
      for (var i = 0; i < allSubjects.names.length; i++) {
        let subject = new Subject();
        subject.setName(allSubjects.names[i]);
        subject.setId(allSubjects.ids[subject.getName()]);
        let evaluation = await this.getEvaluationByUsername(username, subject.getId());
        subject.setEvaluation(evaluation);
        this.subjects.push(subject);
      }
      this.subjects.forEach((subject, i) => {
        this.storage.set(i.toString(), subject.getName().toString());
        this.storage.set(subject.getName() + "_id", subject.getId().toString());
        this.storage.set(subject.getName() + "_evaluation", subject.getEvaluation().toString());
        this.storage.set(subject.getName() + "_isActived", "true");
      });
      this.storage.set("allSubjectsSet", "true");
      this.storage.set("subjectsLength", this.subjects.length.toString());
    } else {
      for (var i = 0; i < parseFloat(this.storage.get("subjectsLength")); i++) {
        let subject = new Subject();
        let name = this.storage.get(i.toString());
        subject.setName(name);
        let id = this.storage.get(name + "_id");
        subject.setId(parseFloat(id));
        let evaluation = this.storage.get(name + "_evaluation");
        subject.setEvaluation(parseFloat(evaluation));
        this.subjects.push(subject);
      }
    }
    await this.getByClass("well clearfix", async element => {
      let avarageSubjectSum = 0;
      let subjectsCount = 0;
      this.subjects.forEach(subject => {
        if (!isNaN(subject.getEvaluation()) && this.storage.check(subject.getName() + "_isActived", "true")) {
          subjectsCount++;
          avarageSubjectSum += subject.getEvaluation();
        }
      });
      let avarage = (avarageSubjectSum / subjectsCount).toFixed(this.AVARAGE_DECIMAL_PARTS);
      var averageElement = null;
      if (document.getElementById("alunoAvarageText")) averageElement = document.getElementById("alunoAvarageText");else {
        averageElement = document.createElement("p");
        averageElement.id = "alunoAvarageText";
      }
      averageElement.innerHTML = "O aluno tem uma média de " + avarage + " pontos";
      if (!document.getElementById("alunoAvarageText")) element.appendChild(averageElement);
    });
    this.getByClass("span2 sidebar", element => {
      if (document.getElementById("evaluationsCheckers")) return;
      const subjects = this.subjects.map(subject => {
        const SubjectElementCheckbox = () => VM.h("input", {
          type: "checkbox",
          id: subject.getName() + "_checkbox",
          onclick: () => {
            this.storage.set(subject.getName() + "_isActived", this.storage.check(subject.getName() + "_isActived", "true") ? "false" : "true");
            this.index();
          },
          checked: this.storage.check(subject.getName() + "_isActived", "true")
        });
        const SubjectElementText = () => VM.h("label", {
          for: subject.getName() + "_checkbox",
          style: "\r font-size: 0.8rem;\r margin-bottom: 0rem;\r user-select: none;\r padding-left: 0.5rem;\r fontSize: 0.8rem;"
        }, subject.getName() == "Tecnologias de Informação e Comunicação" ? "TIC" : subject.getName());
        const SubjectAvarageScore = () => VM.h("span", {
          style: "padding-left: 0.5rem;"
        }, subject.getEvaluation().toString());
        return VM.h("div", {
          style: "display: flex; flex-direction: row; align-items: center; justify-content: start; padding: 0.25rem;"
        }, VM.h(SubjectElementCheckbox, null), VM.h(SubjectElementText, null), VM.h(SubjectAvarageScore, null));
      });
      const Div = () => VM.h("div", {
        id: "evaluationsCheckers",
        style: "padding-left: 0.8rem; padding-right: 0.8rem;"
      }, subjects);
      element.append(VM.m(VM.h(Div, null)));
    });
  }
  async getAllSubjectsFromCourse(id) {
    let couseURL = "https://oghma.epcc.pt/courses/" + id;
    let subjects = {
      ids: {},
      names: []
    };
    await fetch(couseURL).then(async html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(await html.text(), 'text/html');
      let trs = doc.querySelectorAll("tbody > tr");
      trs.forEach(function (tr) {
        let td = tr.querySelector("td");
        let subject = td.querySelector("a");
        let subjectTitle = subject.textContent;
        if (subjectTitle.endsWith(" ")) {
          subjectTitle = subjectTitle.trimEnd();
        }
        let subjectId = subject.href.split("/")[4];
        subjects.ids[subjectTitle] = parseFloat(subjectId);
        subjects.names.push(subjectTitle);
      });
    });
    return subjects;
  }
  async getEvaluationByUsername(username, subjectId) {
    let subjectEvaluationsURL = "https://oghma.epcc.pt/units/" + subjectId + "/evaluations";
    let evaluation = 0;
    await fetch(subjectEvaluationsURL).then(async html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(await html.text(), 'text/html');
      let trs = doc.querySelectorAll("tbody > tr");
      trs.forEach(function (tr) {
        let tds = tr.querySelectorAll("td");
        if (tds.length > 0) if (tds[1].textContent.replace(/\s/g, "").toLowerCase() == username.replace(/\s/g, "").toLowerCase()) evaluation = parseFloat(tds[2].textContent.split(" ")[0]);
      });
    });
    return evaluation;
  }
}

class Subscriptions extends MainController {
  async index() {
    this.setDecrescent();
    this.getByClass("student active", element => {
      element.querySelectorAll("a").forEach(function (a) {
        a.href += "/evaluations";
      });
    });
    this.getAll(".student:not(.active)", this.hide);
    this.getByClass("users-list photo", this.flex);
    this.getByClass("users-list photo", element => {
      element.style.flexWrap = "wrap";
    });
    let avarageSum = 0;
    let totalStudents = 0;
    this.getByClass("student active", async element => {
      var id = element.querySelector("a").href.split("/")[4];
      var evaluationsURL = "https://oghma.epcc.pt/users/" + id + "/evaluations";
      if (id) await fetch(evaluationsURL).then(async html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(await html.text(), 'text/html');
        var avarage = this.getAvarage(doc);
        avarageSum += avarage;
        totalStudents++;
        element.style.order = (this.storage.check("DECREASE", "true") ? '-' : '') + (avarage * 1000).toFixed(0);
        var averageElement = document.createElement("p");
        averageElement.textContent = "Média de " + avarage.toFixed(this.AVARAGE_DECIMAL_PARTS) + " pontos";
        element.appendChild(averageElement);
      });else {
        this.totalAvarage = avarageSum / totalStudents;
        element.querySelector("p").textContent = "Média de " + this.totalAvarage.toFixed(this.AVARAGE_DECIMAL_PARTS) + " pontos";
        element.style.order = (this.storage.check("DECREASE", "true") ? '-' : '') + (this.totalAvarage * 1000).toFixed(0);
      }
    });
    this.getByClass("users-list photo", element => {
      var avarageStudent = document.createElement("li");
      var imageA = document.createElement("a");
      var image = document.createElement("img");
      var br = document.createElement("br");
      var span = document.createElement("span");
      var a = document.createElement("a");
      var p = document.createElement("p");
      avarageStudent.className = "student active";
      image.src = "https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png";
      image.style.height = "79px";
      image.style.width = "auto";
      span.textContent = "Média";
      a.textContent = "Aluno Médio";
      imageA.appendChild(image);
      avarageStudent.appendChild(imageA);
      avarageStudent.appendChild(span);
      avarageStudent.appendChild(br);
      avarageStudent.appendChild(a);
      avarageStudent.appendChild(p);
      element.appendChild(avarageStudent);
    });
  }
  getAvarage(page) {
    var avarage = 0;
    var sumAll = 0;
    var countAll = 0;
    page.querySelectorAll("tr").forEach(tr => {
      if (tr.className != "header") {
        var tds = tr.querySelectorAll("td");
        sumAll += parseInt(tds[2].textContent);
        countAll++;
      }
    });
    avarage = sumAll / countAll;
    return avarage;
  }
}

class Default extends MainController {
  async index() {
    this.getByClass("well clearfix", element => {
      const App = () => VM.h("div", null, VM.h("h1", null, "Welcome to BetterOghma"));
      element.append(VM.m(VM.h(App, null)));
    });
  }
}

// setItem("DECREASE", getItem("DECREASE", "true"));

let url = window.location.href;
let urlArray = url.split("/");
let page = urlArray[urlArray.length - 1].replace(/#/g, "");
let routes = {
  default: Default,
  evaluations: Evaluations,
  subscriptions: Subscriptions
};
if (!routes[page]) page = 'default';
let controller = new routes[page](urlArray);
controller.index();

})();
// Leonardo Abreu de Paulo 2023