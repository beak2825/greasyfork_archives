// ==UserScript==
// @name        Coursera.org: add links to courses on specialization page
// @description Adds links to courses on specialization page. That's it!
// @namespace   https://userscript.coursera.org/
// @include     https://www.coursera.org/specializations/*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31332/Courseraorg%3A%20add%20links%20to%20courses%20on%20specialization%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/31332/Courseraorg%3A%20add%20links%20to%20courses%20on%20specialization%20page.meta.js
// ==/UserScript==

(function () {
  var coursesData = window.App.context.dispatcher.stores.NaptimeStore.data['courses.v1'];

  var coursesByName = {};

  coursesData.forEach(function (course) {
    coursesByName[course.name] = course;
  });

  var courseNameEls = document.getElementsByClassName('course-name');

  var container = document.createElement('div');
  container.style = 'position: fixed;top: 0;z-index: 9999;left: 0;margin-left: 5px;background: white;margin-top: 70px;padding: 10px;border-radius: 5px;'

  Array.from(courseNameEls).forEach(function (el, index) {
    var course = coursesByName[el.innerText];

    if (typeof(course) === 'undefined') return;

    var link = document.createElement('a');
    link.style = 'display: block;';

    link.href = '/learn/' + course.slug;
    link.innerHTML = (index + 1) + '. ' + el.innerHTML;

    container.appendChild(link);
  });

  document.body.appendChild(container);
  console.log('Links to courses loaded!');
})();
