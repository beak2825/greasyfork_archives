// ==UserScript==
// @name         SortThemAll
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       Microblink
// @include      /^https:\/\/(mls|mb2).microblink.com\/eval\?(set|model)=.*/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/379335/SortThemAll.user.js
// @updateURL https://update.greasyfork.org/scripts/379335/SortThemAll.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Your code here...
    function trim(s){
        return ( s || '' ).replace( /^\s+|\s+$/g, '' );
    }

    function compare_iters(aa, bb){
        if(aa.split('/').length == 1) return 1;
        if(bb.split('/').length == 1) return -1;
        if(aa.split('/').length == 1 && bb.split('/').length == 1) return 0;
        var aa_iter = parseInt(trim(aa.split('/')[1]));
        var bb_iter = parseInt(trim(bb.split('/')[1]));

        return aa_iter == bb_iter ? 0 : (aa_iter > bb_iter ? 1 : -1);
    }

    function compare_names(aa, bb){

        var aa_name = trim(aa.split('/')[0]);
        var bb_name = trim(bb.split('/')[0]);

        if(aa_name == bb_name){
            return compare_iters(aa, bb) ? 1 : -1;
        }


        return aa_name > bb_name ? 1 : -1;
    }


    function sort_them_all(){

        var form_control_elements = document.getElementsByClassName("form-control");
        var mode_one_form_control = form_control_elements.item(2);
        var mode_two_form_control = form_control_elements.item(3);

        function sort_form_control(one_form_control){

            if(one_form_control){

                var child_nodes = one_form_control.childNodes;
                var new_child_nodes = [];
                var ordering_mapping = {};
                var unique_count = 0;

                for (var i in child_nodes) {
                    // nodeType == 1 <==> element node
                    if (child_nodes[i].nodeType == 1) { // get rid of the whitespace text nodes
                        new_child_nodes.push(child_nodes[i]);

                        var child_name = trim(child_nodes[i].innerHTML.split('/')[0]);
                        if (child_name in ordering_mapping === false){
                            ordering_mapping[child_name] = unique_count;
                            unique_count += 1;
                        }
                    }
                }

                console.log('Ordering mapping', ordering_mapping);

                function compare_ordering(aa, bb){
                   var aa_name = trim(aa.split('/')[0]);
                   var bb_name = trim(bb.split('/')[0]);
                   return ordering_mapping[aa_name] == ordering_mapping[bb_name]
                    ? compare_names(aa, bb)
                    : (ordering_mapping[aa_name] > ordering_mapping[bb_name] ? 1 : -1)
                }

                new_child_nodes.sort(function(a, b){
                    var compare_res = a.innerHTML == b.innerHTML
                        ? 0
                    //: (a.innerHTML > b.innerHTML ? 1 : -1);
                    //: compare_names(a.innerHTML, b.innerHTML);
                        :compare_ordering(a.innerHTML, b.innerHTML);

                    return compare_res
                });

                console.log('append to new ...');
                for(i=0; i < child_nodes.length; ++i){
                    one_form_control.appendChild(new_child_nodes[i]);
                }
            }
        }

        sort_form_control(mode_one_form_control);
        sort_form_control(mode_two_form_control);

    }

    document.addEventListener("keypress", sort_them_all);

})();