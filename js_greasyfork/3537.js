// ==UserScript==
// @name           Funnyjunk Stupid Sticky Remover
// @description    Removes stupid sticky
// @author         posttwo (Post15951)
// @include        *funnyjunk.com*
// @version        2
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.8.2/jquery.min.js
// @namespace https://greasyfork.org/users/3806
// @downloadURL https://update.greasyfork.org/scripts/3537/Funnyjunk%20Stupid%20Sticky%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/3537/Funnyjunk%20Stupid%20Sticky%20Remover.meta.js
// ==/UserScript==
 


$(document).ready(function ()
{
    $(document).keydown(function(e)
{
if (e.keyCode == 82) {
setTimeout(remove_smiles,1000)
}
});
    function remove_smiles()
{
        $("div[id='cc96820539']").remove();
}
    remove_smiles();
})