// ==UserScript==
// @name         Bees Are Cool
// @description  inconspicuous script
// @version      3.0.2
// @author       Spax
// @namespace    https://github.com/SpiritAxolotl/Bees-Are-Cool
// @homepageURL  https://github.com/SpiritAxolotl/Bees-Are-Cool
// @supportURL   https://github.com/SpiritAxolotl/Bees-Are-Cool/issues
// @match        https://ut-sao-special-prod.web.app/*
// @license      MIT-0
// @icon         https://github.com/SpiritAxolotl/Bees-Are-Cool/blob/main/icon.png?raw=true
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/494210/Bees%20Are%20Cool.user.js
// @updateURL https://update.greasyfork.org/scripts/494210/Bees%20Are%20Cool.meta.js
// ==/UserScript==
/* jshint esversion: 11 */

//REPORT ISSUES IN https://github.com/SpiritAxolotl/Bees-Are-Cool/issues

//for use on https://ut-sao-special-prod.web.app/sex_basis_complaint2.html
//open the console by either F12 or ctrl alt i (or cmd opt i on macos). you can also right click and select "inspect"
//make sure "console" is selected from the top and paste all of this into the text box near the bottom (make sure to edit the "copypasta" variable on line 17 and the "repeat" variable on line 21)
//everything is commented so you can make sure it doesn't do anything malicious
//I still don't recommend running random code from strangers (me included) unless you trust them
//so yeah thank you for trusting me 🙏
//also you should probably do this on a vpn or something, just to be safe

// ------ CONFIG ------

//change this to true if you want the success page to redirect back to the form
let redirectsuccess = false;

//change this to false if you don't want it to autosubmit forms. if set to false, it will also autoscroll to the bottom of the page to make your life just a lil easier :]
let autosubmit = true;

//IF BOTH OF THE ABOVE ARE "true" THE SCRIPT WILL BE IN AN INFINITE LOOP

//number of times to repeat the copypasta
let repeat = 10;

//change to "false" if you're planning on using raw text for the "copypasta" variable
//NOTE: if set to "false" and "copypasta" is a url IT WILL INTERPRET THE URL AS RAW TEXT AND SUBMIT THE URL ITSELF TO THE FORM
let iscopypastalink = true;

//set "copypasta" to raw text or a url (as a string)
//for example:
//let copypasta = `why do they call it oven when you of in the cold food of out hot eat the food?`;
//IF IT IS RAW TEXT CHANGE THE ABOVE VARIABLE TO "false"
//IF YOUR COPYPASTA CONTAINS THE SAME QUOTES AS THE ONES SURROUNDING THE STRING (", ', or `), MAKE SURE TO ESCAPE THEM ALL WITH A BACKSLASH
//examples: "then I said \"real\" and no one laughed" or `I \`love\` backticks` or 'that\'s so interesting'
//backticks (`) will likely be your best bet for avoiding this issue
//I gotta foolproof my code somehow
let copypasta = null;

// ------ END OF CONFIG ------

//sets copypasta to the bee movie script if the variable is "null" or "undefined" beforehand
//meant as a fallback
copypasta ??= "https://gist.githubusercontent.com/MattIPv4/045239bc27b16b2bcf7a3a9a4648c08a/raw/2411e31293a35f3e565f61e7490a806d4720ea7e/bee%2520movie%2520script";

const log = (...args) => {
  console.log(`BAC: ${args.join(", ")}`);
};

const validurl = (str) => {
  //this isn't going to be accurate 100% of the time but if you manage to find an edge case then you probably know how to get around it
  //if not, open an issue and I'll do my best to help with your wacky url
  const valid = str.match(/^(?:blob:)?(?:https?:\/\/|localhost:)[a-z0-9_\-\.]+\.[a-z0-9]+(?:\/.*)?$/i);
  log(`given url (${str}) is ${valid ? "" : "in"}valid!`);
  return !!valid;
};

const tracker = document.createElement("p");

const dispatch = (type) => {
  tracker.dispatchEvent(new Event(type));
};

if (iscopypastalink && validurl(copypasta)) {
  fetch(copypasta, {method: 'GET'})
    .then(response => {
      return response.text();
    })
    .then(data => {
      copypasta = data;
      dispatch("pastaRetrieved");
    })
    .catch(error => {
      log("bazinga :( (failed to load url)");
      console.error(error);
    });
} else if (iscopypastalink) {
  log("you've set 'iscopypastalink' as true, but your link is invalid.\nending script prematurely to prevent submitting a link as raw text.");
  clearInterval(g);
} else dispatch("pastaRetrieved");
//log("mama mia");

{
  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.type = "image/x-icon";
  favicon.href = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAaFQTFRFAAAA/6AA/6AA/6AA/6AA/6AA/6AA/6AA/6AA/6AA/6AA/6AA/6AA/6AA/6AA/6AA/6AA/6AA/6AA/6AA/6AA/6AA/6AA/6AA/6AA/6AA/6AA/sgp/6AA/6AA/6AA/6AA/6AA/8oo/8oo/6AA+ZUE+5kD/6AA/8oo/8oo/8oo/6AA8YUK9IsI/6AA/6AA/8oo/8oo/8oo/8oo+sAs/6AA/6AA+ZUE7X4N7n8N/p0B/6AA/8oo/8oo/MMr8IQL9pAG/6oK/8oo/cUq/6AA+JQF74IL/58A/6oJ/8gm/sgp/6AA/6oK/8oo/6AA95IG9ZgS/8oo/6AA/p8B74EM8pMV/scn+sAs/6AA95AG8pQV/sgn/MMr/6AA/p4B7oAM85UV/8gn/cUq/6AA9o4H85cW/sgp/6AA/Z0B7n8M85gW/8ko/8oo/6AA9YwH85kX/8oo/6AA/6AA/ZwC7X8N9JsX+8As/6AA9IoI9J0Y/MMr/6AA/JoC9Z4Y/cYq84kJ9aAZ/sko+pcE9KAb/cYq+b0t9J8c97ku+b0t97ku97ku97kuWECd0QAAAIt0Uk5TAEMoesYDqf9yLjjY9iWKrwv8wwLl/SQ2b0WXBGb0I6IUKJqV0/Z/K+jgxP//6wkw6v/+DQHy/////2cy7Df//+PvYlL//////42B/7ex///j3/////8PEP///zo//////2Zu//+Qnf////+7zP//5wT3////Eir//z1a//9p//+Ux///v/z//+pAwLrdd34AAAG8SURBVHicfdNBSBRRGAfw/792w1CWwloVDbHUIogiF0Rh1chITAk96GUP4mFPHfZUIR2KiAhPe/DkQTx4MUiJVAwTJUERLBJBKrMQld3CSKPFxbHpzWxv573d1Xf45uP9fw/me8MQ/xf5F5kWZXOU3DsUHCN3xeM4YweAbMPN34CH25nBCXEym1u5JL9nBHm/RDkZKfiJ3E17o3BDB0U/RPGSEbhPfRNtCVd1cG7dqme4BhR/As6Tyzq4+MWqpfwMlHPxsngVLqjAx0VRrf13QAX5B8h5qwKvPVxlHFlzQBXtN55UwfUZUfz2PUzXMWpt5Y+poPENUGvuiM48vR9NzPlKBc2vgZuJg/FEjuJhFbSM4hbX7UFX5B2WDTqgXeiWr6I5K8e3Jh9wQOA52vgRuMAPyRxX+hzQOYDAEnDJUHL4eh0Q7O/ge1zlrJKjuscBd3qD86g0tBw14SQIiSue8cf0HKjvluBuODR1bRypq+GpBF2cuDGSlqPpsQSeEF+m57j9UIJHHMqQt/KBBE9I40Vq7DKP3JfgGQ3oRMRwmfeQ/Fg6cWLlx3GIGitAEmixBhIEWpwCLAItBv4BT2B+IbCirKgAAAAASUVORK5CYII=";
  document.head.appendChild(favicon);
}

const complaintpage = () => {
  //css edits that will make your scrolling experience better
  const styles = document.createElement("style");
  styles.id = "beestyles";
  styles.innerText =
    //clamps text boxes
    `.ql-editor { max-height: 200px; } ` +
    //fixes the word wrap
    `#form-row > form { max-width: 100%; }` +
    //makes it so you can interact with stuff even with the spinner on screen
    `#spinner { pointer-events: none; }`;
  document.head.appendChild(styles);
  
  //list of boxes to check based on their ID
  //might make this more customizable for non-programmers in the future
  const checkids = [
    "cb1",
    "cb8",
    "00N1K00000fXXY0",
    "may-not-disclose-to-third-party",
    "check_certify",
    "check_certify_2"
  ];
  //checks them
  for (const checkbox of checkids)
    document.getElementById(checkbox).checked = true;
  //unchecks the rest
  const allSelects = Array.from(document.querySelectorAll(`input[type="checkbox"], input[type="radio"]`));
  for (const checkbox of allSelects)
    if (!checkids.includes(checkbox.id))
      checkbox.checked = false;
  
  //sets the input boxes to the copypastas (repeating for the number specified)
  const editables = Array.from(document.querySelectorAll(`[contenteditable="true"]`));
  const editables2 = Array.from(document.querySelectorAll(`:not(.ql-hidden) > input[type="text"]`));
  //stats about how many characters you're submitting
  const totalchars = (editables.length+editables2.length)*copypasta.length*repeat;
  log(`total characters being submitted: ${totalchars.toLocaleString()}\n` +
  `(${(editables.length+editables2.length).toLocaleString()} text boxes, ${copypasta.length.toLocaleString()} copypasta characters, ${repeat.toLocaleString()} repeats)`);
  localStorage.setItem("totalChars", +(localStorage.getItem("totalChars") ?? 0) + totalchars);
  for (const input of editables)
    input.children[0].innerText = copypasta.repeat(repeat);
  for (const input of editables2)
    input.value = copypasta.repeat(repeat);
  
  //LMAOOOOOO YOU CAN JUST ENABLE THE BUTTON AND YOU CAN SKIP THE CAPTCHA
  const submitbutton = document.querySelector("#btn-submit-complaint2");
  
  submitbutton.disabled = null;
  
  //removing the captcha since you actually don't need it now
  document.querySelector(`.g-recaptcha`).remove();
};

//the random school stuff is weird (I don't think it loads immediately) so this is a hacky fix
//what the hell has this become lmao
let cansubmit = false;

const submit = () => {
  if (!schools) return;
  const submitbutton = document.querySelector("#btn-submit-complaint2");
  log("detected page update. attempting to submit...");
  submitbutton.disabled = null;
  
  if (cansubmit) {
    submitbutton.onclick = (e) => {
      log("BUTTON CLICKED");
      //local stats to see how many times you've submitted :p
      if (cansubmit) {
        cansubmit = false;
        const start = Date.now()/1000;
        localStorage.setItem("startAvg", start);
        log(`stopwatch started`);
        localStorage.setItem("numberOfSubmissions", +(localStorage.getItem("numberOfSubmissions") ?? 0) + 1);
        log(`increased submission count to ${localStorage.getItem("numberOfSubmissions") ?? 0}`);
      }
    };
    if (autosubmit) {
      submitbutton.click();
      log("submitted!");
    } else {
      log("done!");
    }
    localStorage.setItem("timeLastSubmitted", new Date());
    window.scrollTo(0, document.body.scrollHeight);
    //clearInterval(s);
  } else log("failed...");
};

const successpage = () => {
  const redirect = !(new URLSearchParams(window.location.search)).has("noredirect");
  //replaces the button with one that goes back to the form
  const button = document.querySelector(`a.btn[href="https://auditor.utah.gov/hotline/"]`);
  if (button) {
    button.innerText = "Back to form submission";
    button.href = "https://ut-sao-special-prod.web.app/sex_basis_complaint2.html";
  }
  //displays how many complaints you've submitted so far
  if (!document.querySelector(`#numberOfSubmissions`)) {
    const h2 = document.createElement("h2");
    h2.id = "numberOfSubmissions";
    document.querySelector(".col-12 > h1")?.append(h2);
  }
  const submissions = +(localStorage.getItem("numberOfSubmissions") ?? 0);
  document.querySelector(`#numberOfSubmissions`).innerText = `(${submissions.toLocaleString()} complaint${submissions!==1?"s":""} submitted so far)`;
  //displays how many total characters you've submitted so far
  if (!document.querySelector(`#totalChars`)) {
    const h3 = document.createElement("h3");
    h3.id = "totalChars";
    document.querySelector("#numberOfSubmissions")?.append(h3);
  }
  const chars = +(localStorage.getItem("totalChars") ?? 0);
  document.querySelector(`#totalChars`).innerText = `(and ${chars.toLocaleString()} character${chars!==1?"s":""} submitted so far)`;
  //calculates and shows the average time it takes to submit each form
  if (!document.querySelector(`#avgTimeToSubmit`)) {
    const end = Date.now()/1000;
    const start = +(localStorage.getItem("startAvg") ?? 0);
    if (start && redirect) {
      localStorage.removeItem("startAvg");
      log(`stopwatch stopped at ${end-start}`);
      const oldavg = +(localStorage.getItem("avgTimeToSubmit") ?? 0);
      const submissions = +(localStorage.getItem("numberOfSubmissions") ?? 0);
      if (oldavg) {
        localStorage.setItem("avgTimeToSubmit",
          ((end - start) + (oldavg * (submissions-1)))/submissions
        );
      } else {
        localStorage.setItem("avgTimeToSubmit",
          (end - start) / submissions
        );
      }
    }
    const h4 = document.createElement("h4");
    h4.id = "avgTimeToSubmit";
    document.querySelector("#totalChars")?.append(h4);
  }
  const avg = Math.round(+(localStorage.getItem("avgTimeToSubmit") ?? 0));
  document.querySelector(`#avgTimeToSubmit`).innerText = `(with ${avg>=60 ? `${Math.floor(avg/60)} minute${Math.floor(avg/60)!==1?"s":""} and ` : ""}${avg%60} second${avg%60!==1?"s":""} on average to submit)`;
  
  if (redirectsuccess && redirect)
    window.location.href = "https://ut-sao-special-prod.web.app/sex_basis_complaint2.html";
};

tracker.addEventListener("pastaRetrieved", (e) => {
  if (window.location.href.match(/https?:\/\/ut-sao-special-prod.web.app\/sex_basis_complaint2\.html/g))
    complaintpage();
});
tracker.addEventListener("schoolsRetrieved", (e) => {
  if (window.location.href.match(/https?:\/\/ut-sao-special-prod.web.app\/sex_basis_complaint2\.html/g))
    buildSchools();
});

let g;
if (window.location.href.match(/https?:\/\/ut-sao-special-prod.web.app\/success\.html/g)) {
  successpage();
  g = setInterval(successpage, 1000);
}

const randomSchool = () => {
  log("choosing random school...");
  //chooses random "school"
  const selectschool = document.getElementById("00N1K00000fGn13");
  const selectedschoolbutton = document.querySelector(`[data-id="00N1K00000fGn13"] .filter-option-inner-inner`);
  if (!schools) {
    log("dropdown doesn't exist yet");
    return;
  }
  const randomschool = selectschool.children[Math.floor(Math.random()*selectschool.children.length)].value;
  selectschool.value = randomschool;
  selectschool.title = randomschool;
  selectedschoolbutton.title = randomschool;
  selectedschoolbutton.innerText = randomschool;
  log(`random school chosen! "${randomschool}"`);
};

let schools;
const schoolslink = "https://gist.githubusercontent.com/SpiritAxolotl/3adbdbd50c98caebd7ffcd06ba9a59ad/raw/1161b63e4d96636c7019ff5d48505774c1956377/schools.json";
fetch(schoolslink, {method: 'GET'})
  .then(response => {
    return response.text();
  })
  .then(data => {
    schools = JSON.parse(data);
    dispatch("schoolsRetrieved");
  })
  .catch(error => {
    log("bazinga :( (failed to load url)");
    console.error(error);
  });

//these are their functions that we are overwriting (update: not anymore lol)
//HOW are these 1) not consts and 2) NOT MINIFIED OR OBFUSCATED?????
//istg if the government finds out that I did this I hope they hire me instead of arresting me
//update: the functions have now been made consts. changing the name of this one so I don't overwrite the original anymore (would cause an error and stop the userscript)
//not much else I can really do tbh. I might experiment with submitting the form in its rawest form somehow
function buildSchools() {
  if (schools && window.location.href.match(/https?:\/\/ut-sao-special-prod.web.app\/sex_basis_complaint2\.html/g)) {
    //sorry for this jquery
    
    $("#00N1K00000fGn13").empty();
    
    schools.forEach((element) => {
      $("#00N1K00000fGn13").append(
        $("<option></option>")
          .attr("value", element.sf_name)
          .attr("data-subtext", element.govt_lvl)
          .text(element.sf_name)
      );
    });
    
    $("#00N1K00000fGn13").append(
      $("<option></option>").attr("value", "Other/Unknown").text("Other/Unknown")
    );
    
    $("#00N1K00000fGn13").selectpicker("refresh");
    randomSchool();
    cansubmit = true;
    submit();
  }
}
window.onload = () => {
  window.email_required = false;
  window.name_required = false;
  window.recaptcha_passed = true;
  //window.file_list = [];
  //window.lookup_file_names = [];
  
  //$("#btn-submit-complaint").hide();
  buildSchools();
};

log("reached bottom of script!");