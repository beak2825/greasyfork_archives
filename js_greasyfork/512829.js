// ==UserScript==
// @name           gitea_colorize_a_visited
// @namespace      https://greasyfork.org/de/users/157797-lual
// @author         fg (csd)
// @description    colorize all visited links. forked from greasyfork.org/scripts/15173
// @version        0.03
// @match          https://git.tiss.tuwien.ac.at/*
// @run-at         document-start
// @grant          none
// @copyright	   (original 2015, 7-elephant) forked by lual
// @license        unknown
// @icon           https://git.tiss.tuwien.ac.at/assets/img/logo.svg
// @downloadURL https://update.greasyfork.org/scripts/512829/gitea_colorize_a_visited.user.js
// @updateURL https://update.greasyfork.org/scripts/512829/gitea_colorize_a_visited.meta.js
// ==/UserScript==
// changes:        2024-09-18 forked
//
///////////////////////////////////////////////////////////////////////////////

(function ()
{

//// Config

// View your old config from Visited
// about:config?filter=extensions.visited

// Copy from extensions.visited.color.visited
var p_color_visited = "CadetBlue";

// Copy from extensions.visited.except
var p_except = "example.com,";

//// End Config

//// Variable

const style_id = "visited-lite-7e-style";
const css_a_visited = " a:visited, a:visited * { color: %COLOR% !important; } ";

//// End Variable

//// Function

function attachOnLoad(callback)
{
	window.addEventListener("load", function (e)
	{
		callback();
	});
}

function attachOnReady(callback)
{
	document.addEventListener("DOMContentLoaded", function (e)
	{
		callback();
	});
}

function isExceptSite(except, site)
{
    var exceptList = except.split(",");
    for (var i = 0; i < exceptList.length; i++)
    {
        var str = exceptList[i].replace(/\s/ig,"");

        var str1 = str;
        if (str1.indexOf(".") != 0 && str1.indexOf("/") != 0)
            str1 = "." + str1;

        var str2 = str;
        if (str2.indexOf("://") != 0)
            str2 = "://" + str2;

        if(str != ""
            && (site.indexOf(str1) > -1 || site.indexOf(str2) > -1))
        {
            return true;
        }
    }
    return false;
}

function addStyle(css)
{
    var style = document.getElementById(style_id);
    if(style == null)
    {
        var heads = document.getElementsByTagName("head");

        if(heads != null && heads.length > 0)
        {
            var head = heads[0];
            var style = document.createElement("style");
            if(style != null)
            {
                style.setAttribute("id",style_id);
                style.setAttribute("type","text/css");
                head.appendChild(style);
            }
        }
    }

    if(style != null)
    {
        style.textContent = String(css);
    }
}

function assignColor(css, color)
{
    return css.replace(/%COLOR%/ig, color);
}

function main()
{
	var url = document.documentURI;
	var css = "";

	css += assignColor(css_a_visited, p_color_visited);

	if(!isExceptSite(p_except, url))
	{
		addStyle(css);
	}
}

//// End Function

attachOnReady(main);

})();

// End