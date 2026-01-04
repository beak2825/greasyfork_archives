// ==UserScript==
// @name         Google Classroom Fortune Teller Revamped!
// @namespace    http://tampermonkey.net/
// @version      2.3
// @description  This simple script tells your fortune when you open or reload Google Classroom. You can add more websites to the script if you desire to have fortunes in other places as well. No need for fortune cookies just open classroom get your fortune! Also supports MCAD's "Canvas" by default.
// @author       Alex
// @match        https://classroom.google.com/
// @match        https://classroom.google.com/h
// @match        https://classroom.google.com/u/0/
// @match        https://classroom.google.com/u/0/h
// @match        https://classroom.google.com/u/1/
// @match        https://classroom.google.com/u/1/h
// @match        https://classroom.google.com/u/2/
// @match        https://classroom.google.com/u/2/h
// @match        https://mcad.instructure.com/
// @icon         https://seeklogo.com/images/G/google-classroom-logo-AD2BE4B278-seeklogo.com.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510086/Google%20Classroom%20Fortune%20Teller%20Revamped%21.user.js
// @updateURL https://update.greasyfork.org/scripts/510086/Google%20Classroom%20Fortune%20Teller%20Revamped%21.meta.js
// ==/UserScript==

//Now supports seasonal fortunes!!!!
//Sponsored and created by Skittles. Sadly I lost my old account for some reason (honestly unsure how it doesn't work), so I've had to create a new one to finally publish this magnum opus of simple coding.
//Now with seasonal fortunes! And secret fortunes!
//Check back for updates occasionally, as there's still much more to add :)

(function() {
    'use strict';
//randomizes the fortune, says Skittles
    Array.prototype.sample = function(){
  return this[Math.floor(Math.random()*this.length)];
}
//define a variable for Skittles' generic fortunes
    let textVariable = (['Warning: Do not eat your fortune','May the force be with you.','Warning: Do not eat your fortune.','You are a superhero! Dont forget it.','Japan has great music!','Today is not a good day to die in glorious battle.','Tis just a flesh wound.','A hot iron does more damage to a hand than a piece of lumber.','Drive carefully this year.','Exclamation!','Technical dificulties are not the end of everything','Life may be short but its long enough to enjoy to its fullest.','MEOW','MADE BY SKITTLES','Life and death are two sides of the same coin: inseparable.','Your life is not determined by fortunes','Happiness can not be bought. Unless you are poor.','Help someone today. They need it.','100+ fortunes included!','Sometimes the fortune is too long and it just isnt a good idea to read it all. This may be one of those times. If it is you can just press Okay and get on with your day. Or you can finish reading this and waste 45 seconds of your life. Your choice. I sure hope you chose correctly as otherwise you might be dissapointed to figure out that there is not a joke at the end of this all.','Sometimes you just need a hug.','Sometimes you just need a good laugh.','Sometimes you just need a rest.','Countless challenges await you. Approach them one by one.','What are those!','When youre feeling down listen to your favorite song.','Baaa','Good and evil reside in us all. Choose your path wisely.','Today is important. But do not forget yesterday. And look forward to tomorrow.','Do not stand on a swivel chair today.','You are a boss! Own it.','You are a boss! Own it.','Warning: dont drink that year-old milk from the back of the fridge.','Humans are lucky. Bookshop cats are even more so.','Notice the small things in life.','sniff a flower and enjoy it.','Politics sometimes really suck. Deal with it.','Respect those around you and they will (hopefully) respect you back.','A poor attitude is a harbinger of eternal madness.','Listen to music and enjoy it today.','Make your next move wisely.','Make your next big decision wisely.','Always finish what you sta','Oops. Wrong fortune.','No one will ruin your day.','The foolish listen to their heart. The wise listen to randomly generated fortunes.','Run.','You are not illiterate','I can not help you for I am just a popup.','If you eat something and nobody seen you eat it. It has no calories.','respect your teachers and you will be rewarded.','The classroom is not for you.','Make your own fortune!','Never stand under a seagull on a statue.','Drink plenty of water today.',':o}',';)',':)',':)','Addictions are not for you.','You will never win the lottery.','You will not win the lottery today.','wear a scarf for it is good.','wear some socks for it is good.','Wear a skirt for it is good.','wear some snowpants for it is good.','Wear a shirt for it is good.','An apple a day keeps the vampires at bay','Do not worry for 2020 is over.','"Insert Minecraft splash text here"','You are doomed.','Some of your fortunes were taken from a random website.','Fake fortune cookie, bro.','Fortune not found: Abort, Retry, Fail?','You will live long and prosper.','Its your attitude, not your aptitude, that determines your altitude.','All your hard work will soon be paid off.','Good fortune is always on your side.','Disregard previous fortune.','Hopefully you didnt order the chicken.','Tomorrow will be a new day.','May the odds be ever in your favor.','April showers bring May flowers, but those bring pilgrims.','An apple a day keeps the fruit flies away','A joke a day keeps the boredom away.','An apple a day keeps the doctor away.','Hats are important today.','MEOW','Rats!','MEOW','It is good luck to hold the door open for someone.','Your friends are by your side.','Everybody is kicking their own chunk of ice.','Warning: Dont look behind you...','Warning: Do not look directly at the sun','Warning: Do not run with scissors today.','Your actions may have good reprecussions','Your actions may have dire consequences.','Magic is real, whether you know it or not.','Plan your next actions carefully...','Wear a mask today.','EEK!','You will never invent time travel.','Your assignment is due soon.','Zoom is around the corner.','You will take a step forward.','Sometimes history is not in your favor.','Good luck!','The day will be good to you.','All homework will eventually come due.','Anthony Chavez stole my script oh no what a terrible tragedy. He will steal your things too...','Stay fresh, cheesebag!','Ask not what your fortune popup can do for you but what you can do for your fortune popup.'].sample());
//define seasonal variables
    let janFort = (['Its January','Happy new year from Skittles!','Heck Yea!','No snowflake in an avalanche ever feels responsible.','I see money in your future... It is not yours though.','You are about to become $8.95 poorer. ($6.95 if you had the buffet)','Three can kep a secret, if you get rid of two.','Happy New Years!!','Happy New Years!!','Whats your New Years resolution?','Your resolve need not be grand.','New year, new beginnings.','New year, new troubles.','New year, new fortune.','Fresh & Clean','A new start is vital in life.'].sample());
    let febFort = (['Its February','Sell your ideas-they have exceptional merit.','If you chase one rabbit, you may catch it; if you chase two rabbits, both will escape.','Chilly','Never trust a fart','Never trust a burgler','Might be groundhog day.','How much ground would a groundhog hog if a groundhog could hog ground?','How much wood would a woodchuck chuck if a woodchuck could chuck wood?','How much pig would a whistlepig whistle if a whistlepig could whistle pig?','Celebrate wildlife, for they are in your future.','BE ALIVE'].sample());
    let marFort = (['Its March','About time I got out of that cookie.','Nothing nothing right in left in my my left right brain brain.','Aint got a pi-day fortune yet. Wait no, we do.','Patrick the day, or Patrick the bob? You may never know.','Wear green today.','A four leaf clover will find its way to you soon.','Easter might be this month.','Eggs and Rabbits!','If your rabbit lays an egg, be worried. Very worried.','Hoppin and Ploppin','Eat a potato chip.','Dont take a selfie today.','Dont take a selfie today. Trust me.','Trust me.'].sample());
    let aprFort = (['Its April','You know the saying, about showers and flowers and pilgrims with diseases','Spring has sprung!!','Have a flowery day~','Do not dwell on your past mistakes','Your day will be very uneventful','This fortune will explode','The thing directly to your left will save you','Be fooled, ya fool!','If you are fooled, fool back.','Might be Easter this month','Egg.','Bunny.','Play a prank on someone.','Prank someone with stickers tomorrow.','Get pranked on!','The one who pulls the prank, pulls the truck.','OwO'].sample());
    let mayFort = (['Its May','Dont let Anthony pilfer your cookies','flowers','Only listen to fortune popup. Ignore all other fortune telling units.','Ur Moms day!','Tuna.','Star Wars woohoo!','The tourist bites the fat of the feast.','Play Cookie Clicker.','Be decent today.','Be indecent today.','Do your homework and you shall inherit millions.','Plant a tree.','Snails are faster than rabbits if you really think about it.','Parrot.','Read Intertidal.','Build a computer today.','Take a vacation to a warmer place if it makes any sense at all.'].sample());
    let junFort = (['Its June','Yo are about to finish reading a fortune.','How much deeper would the ocean be without sponges?','It will be (insert weather here) eventually','A cat meows in your general direction','you have be blessed by random unlucky luck','A cat has slurped your toothbrush.','Ur Dads day!','June 21st is the summer solstice, I think.','The longest day often has the shortest night.','The longest day often has the least amount of teeth.','Weed your gardens today.','To weed your garden is to clear your mind.'].sample());
    let julFort = (['Its July','roast an egg on a sidewalk today','oooo sparkle sparkle flashy','Be kind to pigeons. A statue will someday be made of you.','Blessed are the children for they shall inherit the national debt.','You are one in 8 billion.','Fireworks are not food.','Eat ice cream today.','Junk food may be bad, but its darn delicious!','Eat a pringle.','Avocado good fortune for you.','The early bird gets tired before dusk.','The early bird gets the seeds before the squirrels do.','Muahahaha','Help me Im stuck!','What!?'].sample());
    let augFort = (['Its August','Bowling pin cat?','Was it yummy?','Was it crunchy?','The situation - it will cool down soon.','Every mountain climbed is a lesson learned.','Climb a (metaphorical) mountain today.','Capitalism is the rats butthole of politics.','Capitalism *YayYAyAYAaaay* uwu xd bruh','UwU','Chocolate chip cookies are the tables legs.','Banananananananana','Dont fall into the spooder moon.','Watch the moon tonight.','Gutenburg.','Im running out of fortune ideas.','Queueing has five vowels in a row. Do you?','hlp'].sample());
    let skittlesMadeThis = (['Its September','huh!?','Anthony will eat your lunchables and juice box','Pumpkin spice','The leaves are changing color... in Minnesota at least','Be patient: in time, even an egg will walk.','When in doubt, mumble.','From the latin septem, for seven.','small animals are following you...','When ginger snaps, the weather will be cold.','I cant believe youre about to eat my tiny home. Says fortune cookie.','This cookie is never gonna give you up, never gonna let you down.','Good fortune be with ye','Whats the vibe here?',''].sample());
    let octFort = (['Its October','Spooky Season is upon us.','A pumpkin is a pumpkin.','Todays fortune is pumpkin spice!','Good meals shall be had when leaves fall.','If you eat something and nobody sees you eat it, it has no calories.','Trick or treat!','Treat or trick!','Everything is candy if you will it so.','Boo!','Watch a horror movie.','Enjoy yourself while you can.','That wasnt chicken.','Costumes may inspire confidence','Ghosts will be your friends','Beware!','scary fortune','Dont look at the moon','h a u n t e d','Spooky Season Woohoo!','Hide','Run','Hurry','Luck!','Fudgenuggets mcgoobinsmorkers wheres my hat','There are two types of people in this world. Those who find candy sweet, and those who dont.'].sample());
    let novFort = (['Its November','Help! Im trapped in a cookie!','Lets thanks to the giving!','Juicy turkey.','A turkey is the centerpiece of your livlihood.','Give thanks to someone.','When someone next thanks you, it means more than you think.','Thank someone today.','Thanks!','Turkeys will rebel, replace them with pumpkin spice.','When teachers are paid well, its a miracle.','Give someone an apple.','Give someone an apple, or else...','Retrace your steps.','Thurkheeyy','Is a dank meme a fortune in disguise?','Good luck!','Good luck...'].sample());
    let decFort = (['Its December','Tis the season to read fortunes!','Tis the season to throw snow at your enemies','Tis the season to throw snow at your friends','Dont eat yellow snow.','Happy Christmas!','Happy Kwanza','Happy Chanukah','Wear an ugly sweater to make yourself look beautiful by comparison.','Oh dip!','Wear an ugly sweater today.','Dont wear an ugly sweater, please.','Every snowflake is unique.','Every snowflake is uniquely broken.','Throwing a snowball only works if you are in a cold climate.','The shortest day of the year brings the longest blessings.','Wholly solstice!'].sample());
//first alert
    alert('...and today your fortune is...');
//makes seasonal fortunes by month, defines time and stuff
    const today = new Date();
const month = today.getMonth(); // 0 for January, 1 for February, etc.
    const now = new Date();
const minute = now.getMinutes();
    const wow = new Date();
const day = now.getDay();
    const mom = new Date();
const hour = now.getHours();
//Using (un)nested randomizers to finally get the right variables and stuff for the time of year.
if (minute == 0) {
  alert('on the dot!')
} else if (month == 9 && minute == 30) {
  alert('Lucky! Youve earned the rarest fortune of them all. No literally. This baby only comes round around thirty times a year.')
  alert('To prove it, heres a second fortune attached:')
  alert('Your pages will load longer tomorrow at this time.')
} else if (month == 2 && day == 14 && hour == 1 && minute == 59) {
  alert('Happy Pi Day! Made it just on time~')
} else if (day >= 28 && minute == 45) {
  window.prompt("Why cant I get out of here?");
  alert ('Im stuck in a computer program. oh no..')
  let person = window.prompt("Help me get outta here! Type GETOUTTATHERE if you wanna help, or I'll be stuck here forever...","type here");
  if (person == null || person == "") {
  alert('oh no whyyyyyy');
} else if (person == "GETOUTTATHERE") {
  alert('Yay thankyuuuu :)');
} else if (person != "GETOUTTATHERE") {
  alert('That wasnt helpful :( :(');
}
//the actual from above, the few right above this are rare scenarios.
} else if (month >= 0 && month <= 0) {
  alert([janFort,textVariable].sample());
} else if (month == 1) {
  alert([febFort,textVariable].sample());
} else if (month == 2) {
  alert(['One third, in theory.',marFort,textVariable].sample());
} else if (month == 3) {
  alert([aprFort,textVariable].sample());
} else if (month == 4) {
  alert([mayFort,textVariable].sample());
} else if (month == 5) {
  alert([junFort,textVariable].sample());
} else if (month == 6) {
  alert([julFort,textVariable].sample());
} else if (month == 7) {
  alert([augFort,textVariable].sample());
} else if (month == 8) {
  alert([skittlesMadeThis,textVariable].sample());
} else if (month == 9) {
  alert([octFort,textVariable].sample());
} else if (month == 10) {
  alert([novFort,textVariable].sample());
} else if (month == 11) {
  alert([decFort,textVariable].sample());
} else {
  alert('error, yo calendar is probably girbled up');
}
//specialz
if (month == 4 && day == 4) {
  alert('P.S. May the 4th be with you :D')
}
//more updates hopefully someday, by Skittles.
})();
//copyright Skittles/Alex, September 2024. Original published in 2021.
//trademark Skittles/Alex, September 2024. Original published in 2021.
