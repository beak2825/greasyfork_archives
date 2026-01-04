// ==UserScript==
// @name         Golden Theme
// @namespace      https://greasyfork.org/en/users/1353946-stragon-x
// @version        1.0
// @license        N/A
// @description  Golden theme and new Persian font
// @author       STRAGON
// @match        https://gartic.io/*
// @icon         https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/532ac8fa-5d42-4cd0-823a-13c07e3a7350/di378ag-8ec9aff3-702d-4593-98c9-2f1ed85373a7.jpg/v1/fill/w_1024,h_768,q_75,strp/skeleton_king_gold_skull_marble_statue_creature_by_badgercmyk_di378ag-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzY4IiwicGF0aCI6IlwvZlwvNTMyYWM4ZmEtNWQ0Mi00Y2QwLTgyM2EtMTNjMDdlM2E3MzUwXC9kaTM3OGFnLThlYzlhZmYzLTcwMmQtNDU5My05OGM5LTJmMWVkODUzNzNhNy5qcGciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.80pdexYUnJe72z2t0dSp5QJqa026J63vL7DfFe1NBoU
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529572/Golden%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/529572/Golden%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';
  function setCSS(){
        var css = `
@import url('https://fonts.googleapis.com/css2?family=Lemonada:wght@400&display=swap');
body {
    background-image: url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/532ac8fa-5d42-4cd0-823a-13c07e3a7350/di378ag-8ec9aff3-702d-4593-98c9-2f1ed85373a7.jpg/v1/fill/w_1024,h_768,q_75,strp/skeleton_king_gold_skull_marble_statue_creature_by_badgercmyk_di378ag-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzY4IiwicGF0aCI6IlwvZlwvNTMyYWM4ZmEtNWQ0Mi00Y2QwLTgyM2EtMTNjMDdlM2E3MzUwXC9kaTM3OGFnLThlYzlhZmYzLTcwMmQtNDU5My05OGM5LTJmMWVkODUzNzNhNy5qcGciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.80pdexYUnJe72z2t0dSp5QJqa026J63vL7DfFe1NBoU');
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    font-family: 'Lemonada', sans-serif;
    }
@media screen and (max-height: 641px), screen and (max-width: 1151px) {
  #screenRoom.common .ctt #interaction #answer .history .msg, #screenRoom.common .ctt #interaction #chat .history .msg {
    font-size: 12px;
    line-height: 15px;
  }
}
#screenRoom .ctt #interaction #answer .history .msg, #screenRoom .ctt #interaction #chat .history .msg {
  color: #fff;
  font-size: 16px;
  line-height: 16px;
  word-break: break-all;
  word-break: break-word;
}
#screenRoom .ctt #interaction {
  margin: 25px 0 0 23px;
  grid-area: c;
  -ms-grid-row: 2;
  -ms-grid-column: 2;
  min-height: 0;
  min-width: 0;
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -moz-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-direction: normal;
  -webkit-box-orient: horizontal;
  -webkit-flex-direction: row;
  -moz-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
    background-image: url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/532ac8fa-5d42-4cd0-823a-13c07e3a7350/di378ag-8ec9aff3-702d-4593-98c9-2f1ed85373a7.jpg/v1/fill/w_1024,h_768,q_75,strp/skeleton_king_gold_skull_marble_statue_creature_by_badgercmyk_di378ag-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzY4IiwicGF0aCI6IlwvZlwvNTMyYWM4ZmEtNWQ0Mi00Y2QwLTgyM2EtMTNjMDdlM2E3MzUwXC9kaTM3OGFnLThlYzlhZmYzLTcwMmQtNDU5My05OGM5LTJmMWVkODUzNzNhNy5qcGciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.80pdexYUnJe72z2t0dSp5QJqa026J63vL7DfFe1NBoU');
  border: 1px solid #979797;
  -webkit-border-radius: 12px;
  -moz-border-radius: 12px;
  -ms-border-radius: 12px;
  -o-border-radius: 12px;
  border-radius: 12px;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,.5);
}
#screenRoom .ctt .users-tools #users .user .infosPlayer .points {
  color: #FFD700;
  font-size: 20px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: NunitoBlack;
}
#screenRoom .ctt .users-tools #users .user.turn .infosPlayer .nick, #screenRoom .ctt .users-tools #users .user.turn .infosPlayer .points {
  color: #FFD700;
}
#screenRoom .ctt .users-tools #users .user.turn::before {
  color: #FFD700;
}
#screenRoom .ctt .users-tools #users .user .avatar {
box-shadow: 0 0 0 4px #fff;
}
#screens > div {
  background-color: #00000059;
  border : 2px solid #fff;
}
.rooms .scroll a:not(.emptyList):not(.loading) {
  background-color: #fff0;
  border: 6px solid #fff;

}
.interaction{
    background-image: url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/532ac8fa-5d42-4cd0-823a-13c07e3a7350/di378ag-8ec9aff3-702d-4593-98c9-2f1ed85373a7.jpg/v1/fill/w_1024,h_768,q_75,strp/skeleton_king_gold_skull_marble_statue_creature_by_badgercmyk_di378ag-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzY4IiwicGF0aCI6IlwvZlwvNTMyYWM4ZmEtNWQ0Mi00Y2QwLTgyM2EtMTNjMDdlM2E3MzUwXC9kaTM3OGFnLThlYzlhZmYzLTcwMmQtNDU5My05OGM5LTJmMWVkODUzNzNhNy5qcGciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.80pdexYUnJe72z2t0dSp5QJqa026J63vL7DfFe1NBoU');

}
#screenRoom .ctt .users-tools #users .user .infosPlayer .nick {
  color: #fff;
  font-family: NunitoBold;
  font-size: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.2;
}
.rooms .scroll a:not(.emptyList):not(.loading):hover {
  border-color: rgba(0,121,255,.7);
  background-color: #fff0;
}
.rooms .scroll a:not(.emptyList):not(.loading) {
  background-color: #fff0;

}
.rooms .scroll a:not(.emptyList):not(.loading) h5 {
color: #fff;
}
.rooms .scroll a:not(.emptyList):not(.loading) h5 strong {
  color: #fff;
}
.rooms .scroll a:not(.emptyList):not(.loading) .infosRoom > div span:not(.tooltip) {
  color: #fff;
}
.rooms .scroll a:not(.emptyList):not(.loading).bgEmptyRoom {
  background-color: #fff0;
  border-color: #fff0;
}
.scrollElements {
    background-image: url('https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/532ac8fa-5d42-4cd0-823a-13c07e3a7350/di378ag-8ec9aff3-702d-4593-98c9-2f1ed85373a7.jpg/v1/fill/w_1024,h_768,q_75,strp/skeleton_king_gold_skull_marble_statue_creature_by_badgercmyk_di378ag-fullview.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NzY4IiwicGF0aCI6IlwvZlwvNTMyYWM4ZmEtNWQ0Mi00Y2QwLTgyM2EtMTNjMDdlM2E3MzUwXC9kaTM3OGFnLThlYzlhZmYzLTcwMmQtNDU5My05OGM5LTJmMWVkODUzNzNhNy5qcGciLCJ3aWR0aCI6Ijw9MTAyNCJ9XV0sImF1ZCI6WyJ1cm46c2VydmljZTppbWFnZS5vcGVyYXRpb25zIl19.80pdexYUnJe72z2t0dSp5QJqa026J63vL7DfFe1NBoU');
    background-size: cover; /* Adjusts the size of the background image */
    background-position: center; /* Centers the background image */
    background-repeat: no-repeat; /* Prevents the background image from repeating */

}
#background::before {
 display : none;

}
.rooms .scroll a:not(.emptyList):not(.loading) h5 strong {
  font-family: 'Lemonada', sans-serif; ;
  margin-right: 5px;
  font-size: 19px;
}
`;

 var style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }
    setCSS();
})();