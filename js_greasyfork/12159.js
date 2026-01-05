// ==UserScript==
// @name			 DRRR AI Helper
// @namespace		 com.drrr.ai.helper
// @description		 DRRR Auto completion for AI
// @version					  1.9.1
// @include			http://*drrr.*/room*
// @include			https://*drrr.*/room*
// @run-at					document-end
// @downloadURL https://update.greasyfork.org/scripts/12159/DRRR%20AI%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/12159/DRRR%20AI%20Helper.meta.js
// ==/UserScript==

var nameReg = /(@AI|@ai)/;
var instructions = [
  '点歌','點歌','點播','点播','cast song',
  '随机点歌','隨機點歌','隨機點播','随机点播','randomly cast song',
  '搜歌','查歌','找歌','find Song','search Song','look For Song',
  'report','報告','报告',
  'lyrics on','歌詞開','歌词开',
  'lyrics off','歌詞關','歌词关',
  'next Up','下一首',
  'randomly next Up','隨機下一首',
  'sudo say','sudo leave','sudo loop'
];

unsafeWindow.$('.room-input-wrap textarea').textcomplete([
  {
    match: /\B(@AI|@ai)(\s?)(\S+)(\s?)((\S+)?)/,
    search: function (termWithName, callback) {
      if(instructions.some(function(ins){return termWithName.match(ins) !== null})){
        callback([]);
        return;
      }
      var term = termWithName.replace(nameReg,'').trim();
      this.username = nameReg.exec(termWithName)[0];
      callback($.map(instructions,function(ins){return ins.search(term.toLowerCase()) > -1 ? ins : null}));
    },
    index: 0,
    replace: function (instruction,e) {
      return this.username+ ' ' + instruction + ' ';
    }
  }
]);