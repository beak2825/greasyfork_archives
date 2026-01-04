// ==UserScript==
// @name         Starling Academy Course Workload
// @namespace    https://github.com/renatosbispo
// @version      1.0.2
// @description  Greasy Fork script for the Starling Academy of Music's platform that adds the total duration of a course's classes to the course header.
// @author       Renato Bispo
// @license      MIT
// @homepage     https://github.com/renatosbispo/starling-academy-course-workload
// @supportURL   https://github.com/renatosbispo/starling-academy-course-workload/issues
// @match        https://starlingacademy.com.br/aula/*
// @icon         https://starlingacademy.com.br/wp-content/uploads/2017/03/cropped-starling_reverse-192x192.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/457390/Starling%20Academy%20Course%20Workload.user.js
// @updateURL https://update.greasyfork.org/scripts/457390/Starling%20Academy%20Course%20Workload.meta.js
// ==/UserScript==

function addCourseWorkloadToPage(courseWorkload) {
  const courseHeader = document.querySelector('.course-header');
  const courseWorkloadElement = document.createElement('small');

  courseWorkloadElement.innerText = `Duração: ${courseWorkload}`;
  courseHeader.appendChild(courseWorkloadElement);
}

function getFormattedCourseWorkload(courseWorkloadInHours) {
  const courseWorkloadInHoursIntegerPart = Math.trunc(courseWorkloadInHours);
  const courseWorkloadDecimalPart =
    courseWorkloadInHours - courseWorkloadInHoursIntegerPart;
  const courseWorkloadInHoursMinutesPart = Math.trunc(
    courseWorkloadDecimalPart * 60
  );

  const stringifiedCourseWorkloadInHoursMinutesPart =
    courseWorkloadInHoursMinutesPart < 10
      ? `0${courseWorkloadInHoursMinutesPart}`
      : `${courseWorkloadInHoursMinutesPart}`;

  return `${courseWorkloadInHoursIntegerPart}h ${courseWorkloadInHoursMinutesPart}m`;
}

function getCourseWorkload(shouldFormatResult = false) {
  const classDurations = document.querySelectorAll('.unit_content small');
  const parsedClassDurations = Array.from(classDurations);

  const courseWorkload = parsedClassDurations.reduce(
    (total, durationElement) => {
      const duration = durationElement.innerText;
      const [minutes, seconds] = duration.split('m');
      const parsedMinutes = Number(minutes);
      const parsedSeconds = Number(seconds.replace(/\D/g, ''));

      return total + parsedMinutes * 60 + parsedSeconds;
    },
    0
  );

  const courseWorkloadInHours = courseWorkload / 3600;

  if (!shouldFormatResult) {
    return `${courseWorkloadInHours}`;
  }

  return getFormattedCourseWorkload(courseWorkloadInHours);
}

(function () {
  'use strict';

  const courseWorkload = getCourseWorkload(true);

  addCourseWorkloadToPage(courseWorkload);
})();
