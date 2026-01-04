// ==UserScript==
// @name        Coal replies
// @namespace   soyjak.party
// @match       http*://soyjak.party/*
// @version     1.0
// @author      Nigger
// @description I stole the code from the toad one don't care I also stole the replies
// @license wtfpl
// @downloadURL https://update.greasyfork.org/scripts/459735/Coal%20replies.user.js
// @updateURL https://update.greasyfork.org/scripts/459735/Coal%20replies.meta.js
// ==/UserScript==
const modifiers = ["==", "%%", "--", "'", ""];
let done = new Array(20);
let stringSets = {
  "Nigger Duty so dusty brimstone":["MADE FOR BBC",">femoid asks me what sex is >i reply p into v >blocks me",">Fuck yeah Dylan spread that tight bussy so I can bred your asshole even tho assholes aren't reproductive organs and therefore can't be bred",">You're such a cute femboy Dylan, I can't wait to breed you while we enjoy Jefre Cantu-Ledesma's music and lick the shit from each others assholes","No one said this","It's Tyrone","bumo","bro's names really dylan 💀","Built for buck breaking.","holy shit it’s slang you fucking autist","https://soyjak.party/soy/src/1675949858291.png","You have anal pinworms","U mad wh*TE BOI?","Just want to thank you soysisters for the advice (kitten)","Crush its skull.","you have toxoplasmosis","go back to reddit you fucking faggots","THE FACT THAT YOU FUCKING THINK YOU’RE SOMEHOW JUSTIFIED ENOUGH IN SPAMMING YOUR GARBAGE TO BOAST ABOUT IT, EVEN IGNORING THE COMPLAINTS LEVERAGED BY THOSE WHO DON’T WANT TO INVOLVE THEMSELVES WITH YOU REALLY SHOWS HOW MUCH OF AN INSIPID BEING YOU ARE OBSESSED WITH TRYING TO CONVERT THE WHOLE WORLD TO PEDOS. YOU THINK THE WHOLE ENTIRE WORLD SHOULD BE SATURATED IN NOTHING BUT PEDOPHILIA. TO YOU, IT ISN'T EVEN ENOUGH THAT PEOPLE CAN'T JUST NOT LIKE IT, APPARENTLY YOU THINK THOSE WHO DON'T LIKE IT NEED TO HAVE IT FORCED UPON THEM AND THAT THOSE WHO FURTHER DISSENT WILL HAVE DEFAMOUS PHOTOSHOPS PROLIFERATED OF THEM FOR THE REST OF THEIR LIVES. THIS IS ALL YOU EVER THINK ABOUT, THIS IS ALL YOU EVER WANT ANYTHING TO BE, TO YOU EVERYTHING SHOULD REVOLVE AROUND 'P AND LITERALLY NOTHING ELSE. YOU THINK IT'S THE ONLY THING ANYONE SHOULD EVER WATCH. YOU THINK THE WORST PEOPLE IN THE WORLD ARE THOSE WHO DON'T LIKE IT. THE ONLY ACCOMPLISHMENTS YOU CAN EVER BOAST ABOUT ARE SPREADING THIS GARBAGE TO THE POINT WHERE OTHER PEOPLE REPOST THEM, AND YOU'RE PROMOTING THIS AS A WAY OF LIFE THAT NORMAL PEOPLE SHOULD BE LIVING. YOUR EXISTENCE REVOLVES ONLY AROUND BEING A MALICIOUS SCUMBAG, AND IF YOU DIED IN A HORRIBLE ACCIDENT TOMORROW, WHICH I REALLY HOPE HAPPENS, I WON'T SHED A FUCKING TEAR, PEDO SCUM","https://soyjak.party/soy/src/1675969566304.gif","The Kot stare, when some nigger say something so coalish you gotta hit him with that kot stare","I can't it's over","Peer reviewed studies ? To back up that slanderous claim sis",">yes teacher i properly did my goywork just like you ordered me >i even fact-checked it to be sure i didn’t create a heckin fake news imbecile"]
}
let targetPosts = [];
let sets = [stringSets["Generic"]];
setInterval(() => {
  document.querySelectorAll(".button.alert_button").forEach(e => e.click());
  if (targetPosts.length == 0 || sets.length == 0) {
    return;
  }
  let post = "";
  targetPosts.forEach(p => post += `>>${p}\n`);
  let effect = "";
  if (Math.random() > 0.5) {
    effect = modifiers[Math.floor(Math.random() * modifiers.length)];
  }
  post += effect;
  let strings = sets.flat();
  stringsLength = strings.length;
  let found = false;
  while (!found) {
    text = strings[(Math.floor(Math.random() * stringsLength))];
    if (!done.includes(text)) {
      if (Math.random() > 0.5) {
        text = text.toUpperCase();
      }
      post += text;
      found = true;
      done.unshift(text);
      done.pop();
    }
  }
  post += effect;
  document.querySelector("form[name=post] textarea#body").value = post;
  document.querySelector("form[name=post] input[value*='Reply']").click();
}, 12000);
function addCoalButton(post) {
  post.querySelector(".intro").insertAdjacentHTML("beforeend", `<a href="javascript:void(0);" class="coal" postNumber="${post.getElementsByClassName("post_no")[1].textContent}">[Coal]</a>`);
}
let options = Options.add_tab("coal", "gear", "Coal").content[0];
let optionsHTML = "";
for ([key, value] of Object.entries(stringSets)) {
  optionsHTML += `<input type="checkbox" id="coal-${key}" name="${key}"><label for="coal-${key}">${key}</label><br>`;
}
options.insertAdjacentHTML("beforeend", optionsHTML);
options.querySelectorAll("input[type=checkbox]").forEach(e => {
  e.addEventListener("change", e => {
    sets = [];
    options.querySelectorAll("input[type=checkbox]:checked").forEach(c => sets.push(stringSets[c.getAttribute("name")]));
  });
  e.checked = e.getAttribute("name") == "Generic";
});
const updateObserver = new MutationObserver(list => {
  list.forEach(node => {
    if (node.addedNodes[0].nodeName == "DIV") {
      addCoalButton(node.addedNodes[0]);
    }
  });
});
updateObserver.observe(document.querySelector(".thread"), {
  childList: true
});
[...document.getElementsByClassName("post")].forEach(e => {
  addCoalButton(e);
});
document.addEventListener("click", e => {
  let t = e.target;
  if (t.classList.contains("coal")) {
    if (t.textContent == "[Coal]") {
      t.textContent = "[Uncoal]";
      targetPosts.push(t.getAttribute("postNumber"));
    } else {
      targetPosts = targetPosts.filter(p => p != t.getAttribute("postNumber"));
      t.textContent = "[Coal]";
    }
  }
});