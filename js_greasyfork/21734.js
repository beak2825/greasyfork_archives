window.style = function (s) {
e = document.createElement('style');
e.innerHTML=s;
document.head.appendChild(e)
  console.log('style added!');
};

style=window.style;
style.init=function(){
window.style(
  '.whi{background-color:rgba(255,255,255,0.5);}' +
  '.bla{background-color:rgba(0,0,0,0.5);}' +
  '.red{background-color:hsla(0,100%,50%,0.5);}' +
  '.ora{background-color:hsla(30,100%,50%,0.5);}' +
  '.yel{background-color:hsla(60,100%,50%,0.5);}' +
  '.lim{background-color:hsla(90,100%,50%,0.5);}' +
  '.grn{background-color:hsla(120,100%,50%,0.5);}' +
  '.sky{background-color:hsla(180,100%,50%,0.5);}' +
  '.blu{background-color:hsla(210,100%,50%,0.5);}' +
  '.vlt{background-color:hsla(240,100%,50%,0.5);}' +
  '.ppl{background-color:hsla(270,100%,50%,0.5);}' + 
".typo-cont>pan {\n   display: none;\n}\npan {\n   outline: 1px solid grey;\n}\n.typo {\n   position: relative;\n   border: 1px solid green;\n   margin: 0;\n   padding: 0;\n   background-color: wheat;\n   transition: all 0.4s;\n}\n.typo::before {\n   content: \"\";\n   position: absolute;\n   left: 0;\n   top: 0;\n   height: 100%;\n   width: 100%;\n   border: 0pt solid transparent;\n   border-color: rgba(255, 0, 0, 0.4) transparent transparent transparent;\n   transition: all 0.4s;\n   outline: 3px double lime;\n}\n.t .typo::before,\n.typo-cont:hover .typo::before,\n.typo:hover::before,\n.typo-cont:active .typo::before,\n.typo:active::before,\n.typo-cont:focus .typo::before,\n.typo:focus::before,\n.t::before {\n   position: absolute;\n   left: -11pt;\n   border-width: 11pt;\n   height: 0;\n   outline: 0 none transparent;\n}\n.typo::after {\n   content: attr(typo);\n   position: absolute;\n   white-space: nowrap;\n   top: 0;\n   left: 0;\n   background-color: wheat;\n   opacity: 0;\n   left: -50%;\n   transition: all 0.4s;\n}\n.t .typo::after,.typo-cont:hover .typo::after,\n.typo:hover::after,\n.typo-cont:active .typo::after,\n.typo:active::after,\n.typo-cont:focus .typo::after,\n.typo:focus::after {\n   transform: scale(2);\n   opacity: 1;\n   left: calc(-50% - 1px);\n   border: 1px solid lightgray;\n}\n.typo-cont:hover .typo,\n.typo:hover {\n   background-color: red;\n}\n.typo-cont:focus .typo,\n.typo:focus {\n   background-color: white;\n}\n.typo-cont {\n   background-color: hsla(180, 100%, 50%, 0.5);\n}"
);
}