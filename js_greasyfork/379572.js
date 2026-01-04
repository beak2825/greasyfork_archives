// ==UserScript==
// @name     Doublelist Filter Options
// @description Add filter options to Doublelist listing pages
// @version  3
// @grant       GM.getValue
// @grant       GM.setValue
// @include http://doublelist.com/city/*/*
// @include https://doublelist.com/city/*/*
// @require https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js
// @run-at document-idle
// @namespace https://greasyfork.org/users/257342
// @downloadURL https://update.greasyfork.org/scripts/379572/Doublelist%20Filter%20Options.user.js
// @updateURL https://update.greasyfork.org/scripts/379572/Doublelist%20Filter%20Options.meta.js
// ==/UserScript==

(async () => {
  mainContainer = $('.container')[0]

  filterHTML = '<div class="container" id="filteroptions"><h2>Filters:</h2><br/><div><input name="pics" type="checkbox" id="pics" />&nbsp;<label for="pics">Require Picture</label></div>' +
    '<div><input name="minage" type="number" value="18" id="minage" />&nbsp;<label for="minage">Min Age</label></div>' +
    '<div><input name="maxage" type="number" value="99" id="maxage" />&nbsp;<label for="minage">Max Age</label></div>' + 
    '<div><input name="blocklist" type="text" value="" id="blocklist" />&nbsp;<label for="blocklist">Blocked terms (in title)</label></div>' + 
    '<div><input name="blocklist2" type="text" value="" id="blocklist2" />&nbsp;<label for="blocklist2">Blocked terms (in location)</label></div>' + '</div>'

  mainContainer.innerHTML = filterHTML + mainContainer.innerHTML 

  var updatematches = function(){
    $('.list').hide()

    if($('#filteroptions #pics').is(":checked")){
      $('.list:has(.orn)').show()
    }else{
      $('.list').show()
    }

    posts = $('.list')

    minage = Math.max(18, $('#filteroptions #minage').val())
    maxage = Math.max(minage, $('#filteroptions #maxage').val())

    blocklist = $('#blocklist').val().split(/[\s,;]+/)
   
    blocklist2 = $('#blocklist2').val().split(/[\s,;]+/)
   
    posts.each(function(index){
      if($(this).children('a').children('span').length > 2)
        age = $(this).children('a').children('span')[2].innerText
			else
        age = -1
      
      if(age < minage || age > maxage)
          $(this).hide()
      
      if(blocklist.some(block => block.length > 0 && $(this).children('a').children('span')[0].innerText.toLowerCase().includes(block.toLowerCase())))
          $(this).hide()
      
      if(blocklist2.some(block => block.length > 0 && $(this).children('a').children('span')[1].innerText.toLowerCase().includes(block.toLowerCase())))
          $(this).hide()
      
    })
    
    GM.setValue("minage", minage)
    GM.setValue("maxage", maxage)
    GM.setValue("pics", $('#filteroptions #pics').is(":checked"))
    GM.setValue("blocklist", $('#blocklist').val())
    GM.setValue("blocklist2", $('#blocklist2').val())
  }

  $('#filteroptions #pics').prop('checked', await GM.getValue("pics", false))
  $('#filteroptions #minage').val(await GM.getValue("minage", 18))
  $('#filteroptions #maxage').val(await GM.getValue("maxage", 99))
  $('#filteroptions #blocklist').val(await GM.getValue("blocklist", ""))
  $('#filteroptions #blocklist2').val(await GM.getValue("blocklist2", ""))

  $('#filteroptions #pics').change(updatematches)
  $('#filteroptions #minage').change(updatematches)
  $('#filteroptions #maxage').change(updatematches)
  $('#filteroptions #blocklist').change(updatematches)
  $('#filteroptions #blocklist2').change(updatematches)
  
  updatematches()
  
})();