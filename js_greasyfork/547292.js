// ==UserScript==
// @name         [GC][Backup] - NeoSchool Course Rewards
// @namespace    https://greasyfork.org/en/users/1225524-kaitlin
// @version      1.4
// @license      MIT
// @description  See additional details related to NeoSchool courses and the rewards you can get from them.
// @author       Cupkait
// @match        https://www.grundos.cafe/neoschool/courses/
// @grant        none
// @icon        https://i.imgur.com/4Hm2e6z.png
// @downloadURL https://update.greasyfork.org/scripts/547292/%5BGC%5D%5BBackup%5D%20-%20NeoSchool%20Course%20Rewards.user.js
// @updateURL https://update.greasyfork.org/scripts/547292/%5BGC%5D%5BBackup%5D%20-%20NeoSchool%20Course%20Rewards.meta.js
// ==/UserScript==
const classList = [
  {"lesson": "Starting Science", "reward": "<ul><li><strong>Relic: </strong><a href='/search/items/?item_name=Rainbow%20Negg%20Eraser'>Rainbow Negg Eraser</a></li><li>Boon lasts for seven days</li><li>Three extra zaps at both lab rays.</li><li>If you haven't unlocked the lab ray yet you will get temporary access to use your reward.</li></ul>"},
    {"lesson": "Faerie Studies", "reward": "<ul><li><strong>Relic: </strong><a href='/search/items/?item_name=Faerie%20Eraser'>Faerie Eraser</a></li><li>Receive a guaranteed Faerie Quest from a random faerie seven days in a row.</li></ul>"},
    {"lesson": "Español Uno", "reward": "<ul><li><strong>Relic: </strong><a href='/search/items/?item_name=Rainbow%20Negg%20Eraser'>Rainbow Negg Eraser</a></li><li>Three Spanish NeoSchool books.</li></ul>"},
    {"lesson": "Physical Education", "reward": "<ul><li><strong>Relic: </strong><a href='//search/items/?item_name=Power%20Negg%20Eraser'>Power Negg Eraser</a></li><li>Three r101 neggs</li><li>Six red codestones</li><li>Reduced training time</li><li><strong>BONUS:</strong> The first time you complete this course you will unlock a permanent boon that allows you to pay for your courses in one click.</li></ul>"},
    {"lesson": "Grammar and Language", "reward": "<ul><li><strong>Relic: </strong><a href='/search/items/?item_name=Battle%20Quill'>Battle Quill</a></li><li>Three r101 books</ul>"},
    {"lesson": "Neopian Driver's Ed", "reward": "<ul><li><strong>Relic: </strong><a href='/search/items/?item_name=Power%20Negg%20Eraser'>Power Negg Eraser</a></li><li>Boon lasts for nine days</li><li>Ability to buy stocks as low as 5np</li><li>Ability to buy 2,000 stocks per day</li><li><strong>BONUS:</strong> Active pet at the time of redemption receives a permanent driver's license. When this pet is active and you get the Nigel Random Event, you do not get charged for not having a license.</ul>"},
    {"lesson": "Early Neopian History", "reward": "<ul><li><strong>Relic: </strong><a href='/search/items/?item_name=Battle%20Quill'>Battle Quill</a></li><li>Three additional random relics</li></ul>"},
    {"lesson": "Back to Business", "reward": "<ul><li><strong>Relic: </strong><a href='/search/items/?item_name=Fist%20of%20Power'>Fist of Power</a></li><li>Boon lasts for nine days</li><li>Get 25% off at Neopia Central main shops</li><li>Receive three random job coupons</li></ul>"},
    {"lesson": "Simple Spelling", "reward": "<ul><li><strong>Relic: </strong><a href='/search/items/?item_name=Battle%20Quill'>Battle Quill</a></li><li>Three r101 stamps</li></ul>"},
    {"lesson": "Basic Mathematics", "reward": "<ul><li><strong>Relic: </strong><a href='/search/items/?item_name=Happy%20Negg%20Eraser'>Happy Negg Eraser</a></li><li>Boon lasts for nine days</li><li>Ability to auto-price your shop once per day without using an abacus</li><li>3x <a href='/items/'>Magical Abacus</a></ul>"},
    {"lesson": "Geography", "reward": "<ul><li><strong>Relic: </strong><a href='/search/items/?item_name=Battle%20Quill'>Battle Quill</a></li><li>1x Secret Laboratory Map</li><li>2x additional map pieces, either Secret Laboratory, Petpet Laboratory, or Spooky Treasure Map</li></ul>"},
    {"lesson": "Computer Science", "reward": "<ul><li><strong>Relic: </strong><a href='/search/items/?item_name=Rainbow%20Negg%20Eraser'>Rainbow Negg Eraser</a></li><li>Boon lasts for seven days</li><li>Your game scores will be doubled (can stack with the featured game), you can earn 6 items per day instead of 3, and you are able to earn 120,000 NP daily instead of 60,000 NP.</li></ul>"},
    {"lesson": "Learning Art", "reward": "<ul><li><strong>Relic: </strong><a href='/search/items/?item_name=Battle%20Quill'>Battle Quill</a></li><li>One high-tier paint brush and one middle-tier paint brush.</li></ul>"},
    {"lesson": "Introduction to Fishing", "reward": "<ul><li><strong>Relic: </strong><a href='/search/items/?item_name=Battle%20Quill'>Battle Quill</a></li><li>The first time you complete the course you will permanently unlock free fishing for all of your pets.</li><li>When completing the course again after the permanent unlock, all of your pets will gain 15 fishing levels instead.</li><li>Receive either a Flask of Rainbow Fountain Water or a Mysterious Swirly Potion, and a Irritable Genie-in-a-Bottle or a Flask of Clear, Odourless Liquid</li></ul>"},
    {"lesson": "Português", "reward": "<ul><li><strong>Relic: </strong><a href='/search/items/?item_name=Lenny%20de%20Barcelos'>Lenny de Barcelos</a></li><li>Three additional items from a curated list of items from Portuguese culture.</li></ul>"}
];

const lessonCards = document.querySelectorAll('.lesson_card');
  var infoDiv = document.createElement('p');
infoDiv.style.backgroundColor = 'lightblue';
infoDiv.style.border = '1px solid black';
infoDiv.innerHTML = `<span style="font-weight: bold; color: red; font-size: 16px;">All rewards shown are for a perfect grade.</span><br>Incorrect answers or missed quests will reduce rewards and although I aim to keep this updated, reward possibilities could be adjusted by staff at any time.<br>See something wrong? Neomail <a href='/neomessages/sendmessage/?username=Cupkait'>Cupkait</a>!<br><br><em>Last updated: Apr 20, 2025 🥬</em>`;
  document.querySelector("#page_content > main > div.NeoSchoolHeader.center > div").insertAdjacentElement('afterend', infoDiv);


lessonCards.forEach(lesson => {
  var lessonName = lesson.querySelector('.lesson').innerText.trim();
  var lessonReward = classList.find(item => item.lesson === lessonName)?.reward || 'Not Found';

  var rewardText = document.createElement('p');
  rewardText.classList = 'block';
  rewardText.innerHTML = `<strong>Perfect Grade Reward:</strong> ${lessonReward}`;

  lesson.querySelector('.blurb').insertAdjacentElement('afterend', rewardText);
});


