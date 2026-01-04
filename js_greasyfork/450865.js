// ==UserScript==
// @name         Udemy Course Scraper
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  scraping these damn courses
// @author       wtcherr
// @match        https://www.udemy.com/course/*
// @icon         https://www.udemy.com/staticx/udemy/images/v8/favicon-32x32.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450865/Udemy%20Course%20Scraper.user.js
// @updateURL https://update.greasyfork.org/scripts/450865/Udemy%20Course%20Scraper.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const uniqueId = () => {
    const dateString = Date.now().toString(36);
    const randomness = Math.random().toString(36).substr(2);
    return dateString + randomness;
  };
  const getNumber = (numstr) => {
    const regex = /\d+(\.\d+)?/g;
    let res = numstr.match(regex).join("");
    return parseFloat(res);
  };
  // Your code here...
  function addBtn() {
    let btn = document.createElement("button");
    btn.innerText = "Copy Me!";
    btn.classList =
      "udlite-btn udlite-btn-large udlite-btn-primary udlite-heading-md";
    btn.addEventListener("click", clickHandler);
    btn.style.backgroundColor = "#055ee3";
    let bar = document.querySelector(
      ".slider-menu--slider-menu-container--3b3lf"
    );
    bar.appendChild(btn);
  }
  setTimeout(addBtn, 5000);

  function copyToClipboard(text) {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
  }

  function parseCourse() {
    let title = document.querySelector(".clp-lead__title").innerText;
    let description = document.querySelector(".clp-lead__headline").innerText;
    let link = window.location.pathname;
    let img = document
      .querySelector(".intro-asset--img-aspect--1UbeZ")
      .querySelector("img")
      .getAttribute("src");
    let rating = getNumber(
      document.querySelector(".star-rating--rating-number--2o8YM").innerText
    );
    let totalreviews = getNumber(
      document
        .querySelector(".styles--rating-wrapper--5a0Tr")
        .getElementsByTagName("span")[3].innerText
    );
    let enrollments = getNumber(
      document.querySelector(".enrollment").innerText
    );
    let lastUpdated = document
      .querySelector(".last-update-date")
      .innerText.split(" ")
      .at(-1);

    let price = getNumber(
      document
        .querySelector(".udlite-clp-discount-price")
        .getElementsByTagName("span")[1].innerText
    );
    let learnElements = document
      .querySelector(".what-you-will-learn--what-will-you-learn--mnJ5T")
      .querySelectorAll("li");
    let learnItems = [];
    for (let i = 0; i < learnElements.length; i++) {
      learnItems.push({ id: uniqueId(), text: learnElements[i].innerText });
    }
    let totalLength = document.querySelector(
      ".curriculum--content-length--1XzLS"
    ).innerText;
    const lectureParser = (ele) => {
      let id = uniqueId();
      let title = ele.querySelector(".section--section-title--8blTh").innerText;
      let totalDuration = ele.querySelector(
        ".section--section-content--9kwnY"
      ).innerText;
      let accordionBtn = ele
        .querySelector(".panel--outer-panel-toggler--3I6w6")
        .querySelector("button");
      let checker = ele.querySelector("span").getAttribute("data-checked");
      if (checker === "") accordionBtn.click();
      let lessonsSpans = ele
        .querySelector(".panel--content--2q9WW")
        .querySelectorAll(".section--row--3PNBT");
      let lessonsDuration = ele
        .querySelector(".panel--content--2q9WW")
        .querySelectorAll(".section--item-content-summary--126oS");
      let lessons = [];
      for (let i = 0; i < lessonsSpans.length; i++) {
        lessons.push({
          id: uniqueId(),
          name: lessonsSpans[i].innerText,
          duration: lessonsDuration[i].innerText,
        });
      }
      return {
        id: id,
        title: title,
        totalduration: totalDuration,
        lessons: lessons,
      };
    };
    let lectures = [];
    //expanding the lectures section first
    let expandBtn = document.querySelector(
      ".curriculum--curriculum-show-more--1UKkv"
    );
    expandBtn && expandBtn.click();
    let lectureElements = document.querySelectorAll(".panel--panel--3uDOH");
    for (let i = 0; i < lectureElements.length; i++) {
      lectures.push(lectureParser(lectureElements[i]));
    }

    const instructorParser = (instEle) => {
      let id = uniqueId();
      let name = instEle.querySelector(
        ".instructor--instructor__title--34ItB"
      ).innerText;
      let job = instEle.querySelector(
        ".instructor--instructor__job-title--1HUmd"
      ).innerText;
      let img = instEle
        .querySelector(".udlite-avatar-image")
        .getAttribute("src");
      let rating = getNumber(
        instEle.querySelectorAll(".udlite-block-list-item-content")[0].innerText
      );
      let reviews = getNumber(
        instEle.querySelectorAll(".udlite-block-list-item-content")[1].innerText
      );
      let students = getNumber(
        instEle.querySelectorAll(".udlite-block-list-item-content")[2].innerText
      );
      let courses = getNumber(
        instEle.querySelectorAll(".udlite-block-list-item-content")[3].innerText
      );
      let description = instEle.querySelector(
        ".instructor--instructor__description--1dHxF"
      ).innerText;
      let dict = {
        id: id,
        name: name,
        job: job,
        img: img,
        rating: rating,
        reviews: reviews,
        students: students,
        courses: courses,
        description: description,
      };
      return dict;
    };

    let instructors = [];

    let instructorsNodeList = document.querySelectorAll(
      ".instructor--instructor--1wSOF"
    );
    for (let i = 0; i < instructorsNodeList.length; i++) {
      instructors.push(instructorParser(instructorsNodeList[i]));
    }

    const reviewerParser = (reviewer) => {
      let id = uniqueId();
      let name = reviewer.querySelector(
        ".individual-review--individual-review__name--3slEE"
      ).innerText;
      let initials = reviewer.querySelector(".udlite-avatar").innerText;
      let ratingStr = reviewer.querySelector(".udlite-sr-only").innerText;
      const regex = /\d+(\.\d+)?/g;
      let rating = parseFloat(ratingStr.match(regex)[0]);
      let timeAgo = reviewer.querySelector(
        ".individual-review--individual-review__detail-date--DEkVn"
      ).innerText;
      let review = reviewer.querySelector(
        ".individual-review--individual-review__comment--2o94n"
      ).innerText;
      let dict = {
        id: id,
        name: name,
        initials: initials,
        rating: rating,
        timeago: timeAgo,
        review: review,
      };
      return dict;
    };

    let reviewers = [];

    let reviewersNodeList = document.querySelectorAll(
      ".individual-review--individual-review--1AJi4"
    );
    for (let i = 0; i < reviewersNodeList.length; i++) {
      reviewers.push(reviewerParser(reviewersNodeList[i]));
    }

    const requirementsParser = (req) => {
      return { id: uniqueId(), text: req.innerText };
    };
    let requirements = [];
    let requirementsNodeList = [];
    let component_margins = document.querySelectorAll(".component-margin");
    for (let i = 0; i < component_margins.length; i++) {
      if (
        component_margins[i].querySelector(".requirements--title--2j7S2") !==
        null
      ) {
        requirementsNodeList = component_margins[i].querySelectorAll("li");
      }
    }

    for (let i = 0; i < requirementsNodeList.length; i++) {
      requirements.push(requirementsParser(requirementsNodeList[i]));
    }

    const descriptionParser = (desc) => {
      return { id: uniqueId(), text: desc.innerText };
    };
    let descriptions = [];
    let descriptionsNodeList = document
      .querySelector(".styles--description--3y4KY")
      .querySelectorAll("p");
    for (let i = 0; i < descriptionsNodeList.length; i++) {
      descriptions.push(descriptionParser(descriptionsNodeList[i]));
    }

    let feedbacksNodeList = document.querySelectorAll(
      ".review-summary-widget--rate-percent--2dtfO"
    );
    let feedbacks = [];
    for (let i = 0; i < feedbacksNodeList.length; i++) {
      feedbacks.push({
        value: 5 - i,
        percentage: getNumber(feedbacksNodeList[i].innerText),
      });
    }

    let courseDict = {
      id: uniqueId(),
      title: title,
      description: description,
      link: link,
      img: img,
      instructors: instructors,
      rating: rating,
      enrollments: enrollments,
      totalreviews: totalreviews,
      price: price,
      oldprice: price,
      lastupdated: lastUpdated,
      learnitems: learnItems,
      totallength: totalLength,
      lectures: lectures,
      feedbacks: feedbacks,
      reviewers: reviewers,
      requirements: requirements,
      descriptions: descriptions,
    };
    let pretty = JSON.stringify(courseDict, null, 2);
    copyToClipboard(pretty);
    alert("Copied To Clipboard!");
  }
  function clickHandler() {
    parseCourse();
  }
})();
