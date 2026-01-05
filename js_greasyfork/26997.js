// ==UserScript==
// @name        LOR spoiler
// @namespace   linux.org.ru
// @description Add spoiler functionality
// @include     https://linux.org.ru/*
// @include     https://www.linux.org.ru/*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/26997/LOR%20spoiler.user.js
// @updateURL https://update.greasyfork.org/scripts/26997/LOR%20spoiler.meta.js
// ==/UserScript==

$script.ready('jquery',function(){
  console.log('LOR spoiler is ON');

  // spoiler
  var types = ['cut', 'code', 'pre'];
  var blocks = {
    cut: $('[id ^= cut]'),
    code: $('.code'),
    pre: $('pre:not([class])')
  };

  var total_block_cnt = blocks.cut.length + blocks.code.length + blocks.pre.length;
  var line_limit = total_block_cnt > 2 ? 5 : 15;

  var spoiler_prefix_on = '&gt;&gt;&gt;&nbsp;';
  var spoiler_prefix_off = '&lt;&lt;&lt;&nbsp;';

  var tpl = 
    '<span class="sign">'+
      '<span>'+ spoiler_prefix_on +'</span>'+
      '<a '+
      'id="spoiler-hide-{TYPE}_{ID}" '+
      'href="javascript:void(0);" '+
      'onClick="javascript:var block=$(\'#hide-{TYPE}_{ID}\'); var prefix=this.previousElementSibling;'+
        'if (block.css(\'display\')===\'none\') {'+
          'block.show(); prefix.innerText=\''+spoiler_prefix_off+'\'; } else {'+
          'block.hide(); prefix.innerText=\''+spoiler_prefix_on+'\'; };">'+
      '{TYPE}-spoiler'+
      '</a>'+
    '</span><br/>';

  // change content
  if (total_block_cnt > 0) {
    for (var i = 0; i < types.length; i++) {
      var TYPE = types[i];
      var ID = 0;
      
      blocks[TYPE].each(function() {
        // limit
        var no_hl = $(this).find('pre.no-highlight code');
        var cur_blk = no_hl.length > 0 ?  no_hl : $(this);
        if (cur_blk.text().split("\n").length <= line_limit) return;

        // add spoiler
        var spoiler = tpl.replace(/\{TYPE\}/g, TYPE).replace(/\{ID\}/g, ID);
        $(this).attr('id','hide-'+TYPE+'_'+ ID).hide();
        $(this).before(spoiler);
        
        ID++;
      });
    }
  }
});