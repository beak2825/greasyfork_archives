$(function() {
    $('<div id="contextMenuContainer" style="display: none; position: fixed; border: 1px solid gray; background: #f3f3f3; width:auto; z-index: 100;"><ul id="contextMenu" style="list-style: none; padding: 0px; font-size: 20px;"><li style="font-size: 20px; cursor: pointer; padding-top: 5px; padding-left: 20px; padding-right: 20px; padding-bottom: 5px; text-align: center;"><a href="https://www.patreon.com/bePatron?patAmt=10&u=2614470" target="_new"><img src="https://orig14.deviantart.net/ca4f/f/2015/039/1/5/oox0e_patreon_logo_shine_by_artbrosean-d8h8tmp.png" height="50px" width="50px"/></a></li></ul></div>').appendTo('body');
    var doubleClicked = false;
    $(document).on("contextmenu", function (e) {
        if(doubleClicked == false) {
            e.preventDefault(); // To prevent the default context menu.
            var windowHeight = $(window).height()/2;
            var windowWidth = $(window).width()/2;
            if(e.clientY > windowHeight && e.clientX <= windowWidth) {
                $("#contextMenuContainer").css("left", e.clientX);
                $("#contextMenuContainer").css("bottom", $(window).height()-e.clientY);
                $("#contextMenuContainer").css("right", "auto");
                $("#contextMenuContainer").css("top", "auto");
            } else if(e.clientY > windowHeight && e.clientX > windowWidth) {
                $("#contextMenuContainer").css("right", $(window).width()-e.clientX);
                $("#contextMenuContainer").css("bottom", $(window).height()-e.clientY);
                $("#contextMenuContainer").css("left", "auto");
                $("#contextMenuContainer").css("top", "auto");
            } else if(e.clientY <= windowHeight && e.clientX <= windowWidth) {
                $("#contextMenuContainer").css("left", e.clientX);
                $("#contextMenuContainer").css("top", e.clientY);
                $("#contextMenuContainer").css("right", "auto");
                $("#contextMenuContainer").css("bottom", "auto");
            } else {
                $("#contextMenuContainer").css("right", $(window).width()-e.clientX);
                $("#contextMenuContainer").css("top", e.clientY);
                $("#contextMenuContainer").css("left", "auto");
                $("#contextMenuContainer").css("bottom", "auto");
            }
            $("#contextMenuContainer").fadeIn(500, FocusContextOut());
            doubleClicked = true;
        } else {
            e.preventDefault();
            doubleClicked = false;
            $("#contextMenuContainer").fadeOut(500);
        }
    });
    function FocusContextOut() {
        $(document).on("click", function () {
            doubleClicked = false; 
            $("#contextMenuContainer").fadeOut(500);
            $(document).off("click");           
        });
    }
    GM_registerMenuCommand('Become a Patron', function() { 
        GM_openInTab("https://www.patreon.com/bePatron?patAmt=10&u=2614470");
    }, 'p');
});
