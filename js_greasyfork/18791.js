// ==UserScript==
// @name       Fogbugz Filter Person/只看某人
// @namespace  https://gqqnbig.me
// @version    0.1
// @description 在Fogbug case页面增加下拉框，选择只看某个人的帖子。
// @copyright  2016, Gqqnbig
// @run-at     document-end
// @require    https://code.jquery.com/jquery-2.2.3.min.js
// @include    http://www.fogcreek.com/fogbugz/ or your own sites
// @downloadURL https://update.greasyfork.org/scripts/18791/Fogbugz%20Filter%20Person%E5%8F%AA%E7%9C%8B%E6%9F%90%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/18791/Fogbugz%20Filter%20Person%E5%8F%AA%E7%9C%8B%E6%9F%90%E4%BA%BA.meta.js
// ==/UserScript==
 
function createFilter()
{
    var persons = ["All"];
 
 
    $(".person").each(function ()
    {
        var name = $(this).text().trim();
        if (persons.indexOf(name) === -1)
            persons.push(name);
    });
 
    persons.sort();
 
    //console.log(persons);
 
    var $select = $("<select></select>");
    $select.change(function ()
    {
        var person = $(this).val();
        //alert(person);
        $(".bugevent").each(function ()
        {
            var result = $(this).find(".person").is(function ()
            {
                return person === "All" || $(this).text().trim() === person;
            });
            if (result)
                $(this).closest(".bugevent").css("display", "");//.show();
            else
                $(this).closest(".bugevent").css("display", "none");// hide();
        });
    });
 
    $select.css("visibility", "visible");
    $select.css("display", "inline");
 
    for (var i = 0; i < persons.length; i++)
    {
        $select.append($("<option>" + persons[i] + "</option>"));
    }
 
    var $li = $("<li/>");
 
    $li.append($select);
 
 
    $(".toolbar.buttons").prepend($li);
    //If there is more than one target element, however, cloned copies of the inserted element will be created for each target except for the last one.
    //That's why we cannot register change event later.
}
 
setTimeout(createFilter, 100);