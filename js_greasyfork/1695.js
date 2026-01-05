// ==UserScript==
// @name           BGG QuickBar Helper
// @namespace      dschachtler.dssr.ch
// @description    Allows to rearrange the quickbar elements more easily.
// @include        http://www.boardgamegeek.com/quickbar/edit/*
// @version        2
// @downloadURL https://update.greasyfork.org/scripts/1695/BGG%20QuickBar%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/1695/BGG%20QuickBar%20Helper.meta.js
// ==/UserScript==

var lbl;
var img;
var fadeout = 0.5;
var pickedup = -1;
var rows;
var tbl = document.getElementById("main_content").getElementsByTagName("table")[0];

// remove horizontal header
rows = tbl.getElementsByTagName('tr');
rows[0].parentNode.removeChild(rows[0]);
rows = tbl.getElementsByTagName('tr');

// add vertical headers and move button cells
for (var i = 0; i < 10; i++)
{
	var td
	if (i % 2 == 0)
	{
		var img;
		// edit buttons on this line
		td = rows[i].getElementsByTagName('td')[0];
		td.setAttribute('rowspan', '2');
		td.appendChild(document.createElement('br'));
		img = document.createElement('img');
		img.src = "http://geekdo-images.com/images/icons/silkicons/arrow_switch.png";
		img.addEventListener('click',
			createSwitch(i),
			false
		);
		td.appendChild(img);
		
		// cut buttons from below
		td = rows[i+1].getElementsByTagName('td')[0];
		td.setAttribute('rowspan', '2');
		td.appendChild(document.createElement('br'));
		img = document.createElement('img');
		img.src = "http://geekdo-images.com/images/icons/silkicons/arrow_switch.png";
		img.addEventListener('click',
			createSwitch(i+1),
			false
		);
		td.appendChild(img);
		td.parentNode.removeChild(td);
	}

	var th = document.createElement('th');
	th.width = "50";
	if (i % 2 == 0)
	{
		th.appendChild(document.createTextNode("Label"));
	}
	if (i % 2 == 1)
	{
		th.appendChild(document.createTextNode("URL"));
	}
	rows[i].insertBefore(th, rows[i].firstChild);
	rows[i].appendChild(th.cloneNode(true));
	
	if (i % 2 == 0)
	{
		rows[i].appendChild(td);
	}
}
// rearrange input cells
for (var i = 0; i < 10; i++)
{
	if (i % 2 == 0)
	{
		var urlUp = rows[i].getElementsByTagName('td')[2];
		var urlDown = rows[i+1].getElementsByTagName('td')[1];
		var nameDown = rows[i+1].getElementsByTagName('td')[0];
		
		urlUp.parentNode.removeChild(urlUp);
		nameDown.parentNode.insertBefore(urlUp, nameDown);
		nameDown.parentNode.removeChild(nameDown);
		urlDown.parentNode.removeChild(urlDown);
		rows[i].appendChild(nameDown);
		rows[i+1].appendChild(urlDown);
	}
}
// stretch bottom row cell
rows[10].getElementsByTagName('td')[0].setAttribute('colspan', '6');

function createSwitch(i)
{
	return function()
	{
		doswitch(i);
	}
}

function doswitch(item)
{
	if (pickedup < 0)
	{
		pickedup = item;
	}
	else
	{
		exchange(pickedup, item);
		pickedup = -1;
	}
}

function exchange(item1, item2)
{
	//alert("switching item " + item1 + " with item " + item2);
	var l = label(item1).value;
	var u = url(item1).value;
	
	label(item1).value = label(item2).value;
	url(item1).value = url(item2).value;
	
	label(item2).value = l;
	url(item2).value = u;
}

function url(i)
{
	return document.getElementById('url_' + i);
}

function label(i)
{
	return document.getElementById('label_' + i);
}

/*
<table xmlns="http://www.w3.org/1999/xhtml" width="100%" class="forum_table">
	<tbody>
		<tr>
			<th width="50">Label</th>
			<td width="50" rowspan="2"><img src="http://geekdo-images.com/images/icons/silkicons/cancel.png" /><img src="http://geekdo-images.com/images/icons/silkicons/cut.png" /></td>
			<td><input style="width: 100%" /></td>
			<th width="50">Label</th>
			<td width="50" rowspan="2"><img src="http://geekdo-images.com/images/icons/silkicons/cancel.png" /><img src="http://geekdo-images.com/images/icons/silkicons/arrow_down.png" /></td>
			<td><input style="width: 100%" /></td>
		</tr>
		<tr>
			<th>URL</th>
			<td><input style="width: 100%" /></td>
			<th>URL</th>
			<td><input style="width: 100%" /></td>
		</tr>
	</tbody>
</table>
*/