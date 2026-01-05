// ==UserScript==
// @author        Balázs Orbán (info@balazsorban.com)
// @name          Google Calendar Web Material
// @description   Google Calendar Web Material event flairs
// @match         https://calendar.google.com/*
// @version       2.1.1
// @namespace     https://greasyfork.org/users/39251
// @downloadURL https://update.greasyfork.org/scripts/18878/Google%20Calendar%20Web%20Material.user.js
// @updateURL https://update.greasyfork.org/scripts/18878/Google%20Calendar%20Web%20Material.meta.js
// ==/UserScript==

const grid = document.querySelector('#gridcontainer');
const eventFlairBaseUrl = "url(https://raw.githubusercontent.com/balazsorban44/google-calendar-web-material/master/app/images/event-flairs/";
const eventFlairs = [
  ["art", "sketching workshop", "painting", "drawing workshop", "art workshops", "art workshop"],
  ["badminton", "billiard"],
  ["baseball"],
  ["basketball"],
  ["bbq", "barbeque", "barbecue"],
  ["beer", "Oktoberfest", "Octoberfest", "October Fest", "beers"],
  ["bike", "cycling", "Biking", "bikes", "bicycles", "bicycle"],
  ["bowling"],
  ["breakfast", "brunches", "brunch", "breakfasts"],
  ["camping"],
  ["chinesenewyear", "chinese new years", "chinese new year's", "chinese new year"],
  ["cinema", "movies", "movie"],
  ["clean", "vacuum cleaning", "vacuum clean", "tidy up", "cleaning", "clean the house", "clean the apartment", "clean house"],
  ["code", "Web Programming", "Web Development", "Railsgirls", "Rails Girls", "Programming in Python", "Programming in Java", "learn to code", "Hour of Code", "hackathon", "Computer Science", "coding time", "Codecademy"],
  ["coffee", "coffees"],
  ["cook", "soup", "kitchen", "cooking", "cook"],
  ["dance", "dancing", "dances"],
  ["dentist", "dentistry", "dental"],
  ["dinner", "restaurants", "restaurant", "Family meal", "dinners"],
  ["drinks", "cocktails", "cocktail"],
  ["flight", "plane", "airplane", "aeroplane"],
  ["football", "soccer"],
  ["gig", "gigs", "concerts", "concert"],
  ["golf"],
  ["graduation", "graduate", "final exam"],
  ["gym", "workouts", "workout", "work out", "pushups"],
  ["haircut", "hairdresser", "hair"],
  ["halloween", "helloween", "hallowe'en", "Allhalloween", "All Saints' Eve", "All Hallows' Eve"],
  ["hike", "hiking", "hikes"],
  ["instrument", "tuba", "trumpet", "trombone", "string quartett", "singing", "saxophone", "piano", "orchestra", "oboe", "music ensemble", "music Class", "learninstrument", "guitar lesson", "flute", "cornett", "contrabass", "classical music", "clarinet", "choir practice", "choir", "cello"],
  ["kayaking"],
  ["learn", "Vietnamese Course", "Vietnamese Class", "Ukranian Course", "Ukranian Class", "Turkish Course", "Turkish Class", "Thai Course", "Thai Class", "Swedish Course", "Swedish Class", "Spanish Course", "Spanish Class", "Slovenian Course", "Slovenian Class", "Slovak Course", "Slovak Class", "Russian Course", "Russian Class", "Practice Vietnamese", "Practice Ukranian", "Practice Turkish", "Practice Thai", "Practice Swedish", "Practice Spanish", "Practice Slovenian", "Practice Slovak", "Practice Russian", "Practice Portuguese", "Practice Polish", "Practice Norwegian", "Practice Lithuanian", "Practice Latvian", "Practice Korean", "Practice Japanese", "Practice Italian", "Practice Indonesian", "Practice Hungarian", "Practice Hindi", "Practice Hebrew", "Practice Greek", "Practice German", "Practice French", "Practice Finnish", "Practice Filipino", "Practice Farsi", "Practice English", "Practice Dutch", "Practice Danish", "Practice Czech", "Practice Croatian", "Practice Chinese", "Practice Catalan", "Practice Bulgarian", "Practice Arabic", "Portuguese Course", "Portuguese Class", "Polish Course", "Polish Class", "Norwegian Course", "Norwegian Class", "Lithuanian Course", "Lithuanian Class", "Latvian Course", "Latvian Class", "Korean Course", "Korean Class", "Japanese Course", "Japanese Class", "Italian Course", "Italian Class", "Indonesian Course", "Indonesian Class", "Hungarian Course", "Hungarian Class", "Hindi Course", "Hindi Class", "Hebrew Course", "Hebrew Class", "Greek Course", "Greek Class", "German Course", "German Class", "French Course", "French Class", "Finnish Course", "Finnish Class", "Filipino Course", "Filipino Class", "Farsi Course", "Farsi Class", "English Course", "English Class", "Dutch Course", "Dutch Class", "Danish Course", "Danish Class", "Czech Course", "Czech Class", "Croatian Course", "Croatian Class", "Chinese Course", "Chinese Class", "Catalan Course", "Catalan Class", "Bulgarian Course", "Bulgarian Class", "Arabic Course", "Arabic Class"],
  ["lunch", "lunches", "luncheon"],
  ["massage", "massages", "backrub", "back rub"],
  ["meet", "meeting", "deal", "appointment", "agreement"],
  ["newyear", "new years", "new year's", "new year"],
  ["oilchange", "oil change", "car service"],
  ["pedicure", "pedicures", "manicures", "manicure"],
  ["photography"],
  ["pingpong", "table tennis", "ping-pong", "ping pong"],
  ["plan", "week planning", "vacation planning", "planmyday", "plan week", "plan vacation", "plan quarter", "plan day"],
  ["pride", "worldpride", "world pride", "lesbian pride", "lesbian parade", "lesbian march", "gayglers", "gaygler", "gay pride", "gay parade", "europride", "euro pride", "dyke march", "christopher street day"],
  ["read", "reading", "newspaper", "ebook"],
  ["reading", "bookclub", "book club"],
  ["repair", "plumber", "handyman", "fridge repair", "fix", "electrician", "DIY"],
  ["run", "runs", "running", "jogs", "jogging", "jog"],
  ["sail", "sailing", "sailboat", "sail", "boat cruise"],
  ["santa", "Santa Claus", "Father Christmas"],
  ["ski", "snowshoeing", "Snowboarding", "snow shoe", "skis", "skiing"],
  ["snowboarding", "snow boarding"],
  ["swim", "swims", "swimming"],
  ["tennis"],
  ["thanksgiving"],
  ["violin", "violins"],
  ["walk", "walking"],
  ["wedding", "weddings", "wedding-eve party", "wedding eve"],
  ["write", "phone","phonecall", "phone call", "reach", "contact", "write letter", "send invitations", "reachout", "reach out to"],
  ["xmas", "x-mas", "christmas"],
  ["xmasfood", "xmasmeal", "xmas luncheon", "xmas lunch", "xmas eve luncheon", "xmas eve lunch", "xmas eve dinner", "xmas eve brunch", "xmas dinner", "xmas brunch", "x-mas luncheon", "x-mas lunch", "x-mas eve luncheon", "x-mas eve lunch", "x-mas eve dinner", "x-mas eve brunch", "x-mas dinner", "x-mas brunch", "christmas luncheon", "christmas lunch", "christmas eve luncheon", "christmas eve lunch", "christmas eve dinner", "christmas eve brunch", "christmas dinner", "christmas brunch"],
  ["xmasparty", "xmas party", "xmas eve party", "x-mas party", "x-mas eve party", "christmas party", "christmas eve party"],
  ["yoga"]
];

function changeBg() {
  let monthText = document.querySelectorAll(".wk-dayname span")[0].innerHTML;
  let month;
  if (monthText.slice(monthText.indexOf("/")-2) == " ") {
    month = monthText.slice(monthText.indexOf("/")-1,monthText.indexOf("/"))-1;
  }
  else {
    month = monthText.slice(monthText.indexOf("/")-2,monthText.indexOf("/"))-1;
  }
  document.getElementById("vr-nav").style.backgroundImage = "linear-gradient(rgba(0, 0, 0, 0.5) 0%,rgba(0, 0, 0, 0.4) 6%, transparent 20%), url(https://raw.githubusercontent.com/balazsorban44/google-calendar-web-material/master/app/images/months/" + month + ".jpg)";
}

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        changeBg();
        let events = document.querySelectorAll('.cbrd');
        events.forEach((eventsItem) => {
          compareFunction = (element) => eventsItem.innerText.toLowerCase().indexOf(element) !== -1;
          eventFlairs.forEach((eventFlairsItem) => {
              if (eventFlairsItem.filter(compareFunction).length) {
                  eventsItem.style.backgroundImage = "linear-gradient(rgba(0, 0, 0, .4), transparent 40%)," + eventFlairBaseUrl + eventFlairsItem[0] + ".png)";
              }
          });
        });
    });
});

grid.addEventListener('click', () => {
    setTimeout(() => {
        let bubbleEvent = document.querySelector(".bubblemain");
        let eventTitle = bubbleEvent.innerText.split("\n")[0];
        eventFlairs.forEach((eventFlairsItem) => {
            compareFunction = (element) => eventTitle.toLowerCase().indexOf(element) !== -1;
            if(eventFlairsItem.filter(compareFunction).length){
               bubbleEvent.style.backgroundImage = "linear-gradient(rgba(0,0,0,.5), rgba(0,0,0,.5))," + eventFlairBaseUrl + eventFlairsItem[0] + ".png)";
            }
    });
    },1);

});


const config = {
    attributes: true,
    childList: true,
    characterData: true
};
observer.observe(grid, config);