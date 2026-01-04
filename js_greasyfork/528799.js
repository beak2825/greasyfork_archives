// ==UserScript==
// @name        DEI report spammer
// @namespace   Violentmonkey Scripts
// @match       https://enddei.ed.gov/*
// @grant       none
// @version     2.2
// @author      starsweep
// @description 3/4/2025, 1:29:56 PM, fuck the trump administration >:[
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/528799/DEI%20report%20spammer.user.js
// @updateURL https://update.greasyfork.org/scripts/528799/DEI%20report%20spammer.meta.js
// ==/UserScript==

if(localStorage.getItem("spamToggle") == "True") {
  spamFunc()
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let buzzwords = ["Ableism", "Accessibility", "Accomplice", "Ageism", "Ally", "Bias", "Bigotry", "BIPOC", "Cisgender", "Class", "Classism", "Culture", "D&I", "DEI", "DEIA", "DIB", "Disability", "Discrimination", "Diversity", "Emotional Tax", "Empowerment", "Equity", "Ethnicity", "Feminism", "Gender", "Heterosexism", "Homophobia", "I-200", "Inclusion", "Indigenous", "Institutional Racism", "Intent Vs. Impact", "Intersectionality", "JEDI", "Justice", "Latine", "Latinx", "LGBTQIA+", "Marginalization", "Micro-inequity", "Microaggression", "Neurodiversity", "Non-binary", "OMAD", "Oppression", "Pansexuality", "Performative Allyship", "POC", "Positionality", "Prejudice", "Privilege", "Race", "Racism", "Sexual Orientation", "Social Justice", "Stereotypes", "Systemic Racism", "Institutional Racism", "Tolerance", "Transgender", "UDS", "White Privilege", "Workplace Inclusion", "YEOC"]
let domains = ["gmail.com", "yahoo.com", "hotmail.com", "aol.com", "msn.com", "comcast.net", "live.com", "rediffmail.com", "ymail.com", "outlook.com", "verizon.net"]

let message = ""
for(let i = 0; i <= getRandomInt(3, 10); i++) {
  message += buzzwords[getRandomInt(0, (buzzwords.length - 1))] + " "
}

function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
  var startTimeInMs = Date.now();
  (function loopSearch() {
    if (document.querySelector(selector) != null) {
      callback();
      return;
    }
    else {
      setTimeout(function () {
        if (timeoutInMs && Date.now() - startTimeInMs > timeoutInMs)
          return;
        loopSearch();
      }, checkFrequencyInMs);
    }
  })();
}

const emailInput = document.getElementById("email")
const schoolInput = document.getElementById("location")
const zipInput = document.getElementById("zipcode")
const descInput = document.getElementById("description")

try {
  const submitButton = document.getElementById("submitButton");
  submitButton.insertAdjacentHTML("afterend", "<button id=\"spamButton\" type=\"button\">start spamming :3</button>")
} catch(error){
  window.location.href = "https://enddei.ed.gov/"
}

function spamFunc() {
  $.ajax({
    url: 'https://randomuser.me/api/?inc=email',
    dataType: 'json',
    success: function(data) {
      fakeData = data["results"]["0"]
      emailInput.value = fakeData["email"].replace("example.com", domains[getRandomInt(0, domains.length - 1)]);
      $.ajax({
        url: "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/us-public-schools/records?select=name%2C%20zip&order_by=random(" + getRandomInt(1, 100000).toString() +")&limit=1",
        dataType: 'json',
        success: function(data2) {
          locationData = data2["results"]["0"]
          schoolInput.value = locationData["name"];
          zipInput.value = locationData["zip"];
          descInput.value = message;
          waitForElementToDisplay(".grecaptcha-badge",function(){submitButton.click();},1,9000);
        }
      });
    }
  });
}

function startSpam() {
  localStorage.setItem("spamToggle", "True");
  spamFunc();
}

const spamButton = document.getElementById("spamButton");
spamButton.addEventListener("click", startSpam, false);