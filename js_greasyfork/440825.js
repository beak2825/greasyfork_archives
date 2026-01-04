// ==UserScript==
// @name [git.sr.ht] Sort directories before files
// @description Sort directories before files in repository tree view
// @author b5327157
// @version 1.0.2
// @match *://git.sr.ht/*/tree
// @match *://git.sr.ht/*/tree/*
// @require http://code.jquery.com/jquery-latest.js
// @namespace https://git.sr.ht/~b5327157/user_scripts
// @downloadURL https://update.greasyfork.org/scripts/440825/%5Bgitsrht%5D%20Sort%20directories%20before%20files.user.js
// @updateURL https://update.greasyfork.org/scripts/440825/%5Bgitsrht%5D%20Sort%20directories%20before%20files.meta.js
// ==/UserScript==

// SPDX-License-Identifier: CC0-1.0

(function()
{
    "use strict";

    var tree_list = $(".tree-list");

    var trees = [];
    var blobs = [];
    var names = tree_list.children(".name");
    names.each(function(index)
    {
        if ($(this).hasClass("tree"))
        {
            trees.push(index);
        }
        else if ($(this).hasClass("blob"))
        {
            blobs.push(index);
        }
        else
        {
            return;
        }
    });

    var num_cells = tree_list.children().length;
    var num_rows = names.length;
    var num_columns = num_cells / num_rows;
    if (num_columns * num_rows != num_cells)
    {
        return;
    }

    var tree_list_sorted = tree_list.children().sort(function(a, b)
    {
        var index_a = $(a).index();
        var index_b = $(b).index();

        var row_a = Math.trunc(index_a / num_columns);
        var row_b = Math.trunc(index_b / num_columns);

        var row_a_is_dir = trees.includes(row_a);
        var row_b_is_dir = trees.includes(row_b);

        if (row_a_is_dir != row_b_is_dir)
        {
            return row_a_is_dir ? -1 : 1;
        }

        return index_a - index_b;
    });

    tree_list_sorted.appendTo(tree_list);
})();
