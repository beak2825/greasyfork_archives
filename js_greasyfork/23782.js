// ==UserScript==
// @name            Tool for leetcode.com
// @match           https://leetcode.com/problems/*
// @match           https://leetcode.com/submissions/detail/*
// @description     This tool shows tables on database problems after you submit a wrong answer, so you don't need to read their unreadable JSON representation of tables.
// @version         1.3
// @git             f890188d315661aae24c2b05abfb6feac286c9fe
// @namespace https://greasyfork.org/users/7949
// @downloadURL https://update.greasyfork.org/scripts/23782/Tool%20for%20leetcodecom.user.js
// @updateURL https://update.greasyfork.org/scripts/23782/Tool%20for%20leetcodecom.meta.js
// ==/UserScript==

// @todo table sorting, diff functionality


(function () {

    // dependancies inserted here

    // BEGIN INCLUDE sql_table.js
    /**
     * @file This module works with leetcode's json representable of tables.
     */

    var sql_table = (function ( factory ) {
        var modulize = function ( factory, args ) {
            var callable = function () {
                return modulize( factory, arguments );
            };

            var obj = factory.apply( null, args );
            for ( var prop in obj ) {
                if ( obj.hasOwnProperty( prop ) ) {
                    callable[ prop ] = obj[ prop ];
                }
            }

            return callable;
        };

        return function () {
            return modulize( factory, arguments );
        }
    })( function ( $, _ ) {

        /**
         @typedef {Object} Table
         @property {string}     name    The name of table
         @property {string[]}   headers List of headers
         @property {Array[]}    values  Rows of table
         */


        /**
         * Create table element from a leetcode json
         * @param {Table} obj   Parsed json from "output" or "expected" field
         * @returns {jQuery}    The table object
         */
        var create_table_elem = function ( obj ) {

            /**
             * Return the HTML representation of value wrap in <td>
             * @param value
             * @return {jQuery}
             */
            var repr_cell = function ( value ) {
                if ( _.isNull( value ) ) {
                    return $( '<td>' )
                        .append( $( '<em>' ).text( 'NULL' ) );
                } else if ( _.isString( value ) ) {
                    return $( '<td>' ).text( JSON.stringify( value ) );
                } else if ( _.isNumber( value ) ) {
                    return $( '<td>' )
                        .text( value )
                        .css( 'text-align', 'right' );
                } else {
                    // unknown type
                    return $( '<td>' ).text( value );
                }
            };

            /**
             * Wrap a list of text with tag
             * @param {string[]}    arr
             * @param {string}      tag
             * @returns {jQuery[]}  Array of wrapping element
             */
            var wrap_text = function ( arr, tag ) {
                return _( arr ).map( function ( txt ) {
                    return $( tag ).text( txt );
                } );
            };

            return $( '<table>' )
                .append( $( '<caption>' ).text( obj.name ) )
                .append( $( '<thead>' )
                    .append( $( '<tr>' ).append( wrap_text( obj.headers, '<th>' ) ) ) )
                .append( $( '<tbody>' )
                    .append( _( obj.values ).map( function ( row ) {
                        return $( '<tr>' ).append( _( row ).map( repr_cell ) );
                    } ) ) );
        };


        /**
         * Split the input json from leetcode to multiple table objects
         * @param {Object}                    obj           Parsed json from "input" field
         * @param {Object.<string, string[]>} obj.headers   Table name -> list of headers
         * @param {Object.<string, Array>}    obj.rows      Table name -> list of rows
         * @returns {Object.<string, Table>}                Table name -> table object
         */
        var split_input_table = function ( obj ) {
            var tables = {};
            _( obj.headers ).each( function ( headers, table_name ) {
                var table = {};
                table.name = table_name;
                table.headers = headers;
                table.values = obj.rows[ table_name ];
                tables[ table_name ] = table;
            } );

            return tables;
        };


        return {
            create_table_elem: create_table_elem,
            split_input_table: split_input_table
        };
    } );
    // END INCLUDE sql_table.js


    // BEGIN INCLUDE bootstrap.js
    /**
     * @file Dependancy loader for user scripts.
     */


    // ref: https://gist.github.com/cyranix/6180495

    /**
     * @typedef {Object}    JSModule
     * @property {string}   url
     * @property {Function} has
     * @property {Function} get
     */

    /**
     * Dependancy loader for user scripts.
     * @param {Function}    main                Main function of a user script,
     *                                              call with loaded js modules
     * @param {Object}      opts                Required JS, CSS
     * @param {JSModule[]}  [opts.modules=[]]   Array of JS module specifiers
     * @param {string[]}    [opts.css=[]]       Array of URLs to CSS dependencies
     */
    var bootstrap = function ( main, opts ) {
        /**
         * Load a js url and invoke callback
         * @param {string}      url
         * @param {function}    callback
         */
        var load_js = function ( url, callback ) {
            var script = document.createElement( 'script' );
            script.src = url;
            script.addEventListener( 'load', callback );
            document.body.appendChild( script );
        };

        /**
         * Load a list of css urls
         * @param {string[]} url_list
         */
        var load_css_multi = function ( url_list ) {
            while ( url_list.length > 0 ) {
                var head = document.getElementsByTagName( 'head' )[ 0 ];
                var link = document.createElement( 'link' );
                link.rel = 'stylesheet';
                link.type = 'text/css';
                link.href = url_list.shift();
                link.media = 'all';
                head.appendChild( link );
            }
        };

        /**
         * Load a list of JS modules and invoke callback with a list of loaded module objects
         * @param {JSModule[]}  mod_list
         * @param {Function}    done
         * @param {Object[]}    [loaded]
         */
        var load_js_modules = function ( mod_list, done, loaded ) {
            loaded = loaded || [];
            if ( mod_list.length > 0 ) {
                var mod_specifier = mod_list.shift();
                var existed = mod_specifier.has();
                if ( existed ) {
                    loaded.push( existed );
                    load_js_modules( mod_list, done, loaded );
                } else {
                    load_js( mod_specifier.url, function () {
                        loaded.push( mod_specifier.get() );
                        load_js_modules( mod_list, done, loaded );
                    } );
                }
            } else {
                done( loaded );
            }
        };

        var load_all = function () {
            var css_urls = opts.css || {};
            var modules = opts.modules || [];

            load_css_multi( css_urls );
            load_js_modules( modules, function ( mod_objs ) {
                // start main function
                main.apply( null, mod_objs );
            } );
        };

        load_all();
    };
    // END INCLUDE bootstrap.js


    // BEGIN INCLUDE main.js
    /**
     * @file Main function of this user script
     */

    // Arguments correspond to the dependency references.
    // @see {@link bootstrap} for further information.
    var main = function ( $, _, sql_table ) {
        // Is this a sql problem or sql submission
        var has_sql = $( '*[ng-switch-when=mysql]' ).length > 0 // sql problem
            || (window.pageData && window.pageData.getLangDisplay === 'mysql'); // sql submission
        if ( !has_sql ) {
            return;
        }

        // load sql_table module
        sql_table = sql_table( $, _ );

        // get json from these elements
        var input_id = '#result_wa_testcase_input';
        var output_id = '#result_wa_testcase_output';
        var expected_id = '#result_wa_testcase_expected';
        var last_exe_id = '#last_executed_testcase_output';

        // styles for table
        var table_classes = [ 'pure-table', 'pure-table-bordered', 'pure-table-striped' ];

        /**
         * Create table element from "input" field
         * @param {jQuery} el
         * @return {jQuery[]} Array of table element
         */
        var get_input_tables = function ( el ) {
            // workaround: leetcode is replacing ',' with '\n'
            var json = JSON.parse( el.text().replace( /\n/g, ', ' ) );
            return _( sql_table.split_input_table( json ) ).map( function ( table ) {
                return sql_table.create_table_elem( table )
                    .addClass( table_classes.join( ' ' ) );
            } );
        };

        /**
         * Create table element from "output" or "expected" field
         * @param {jQuery} el
         * @return {jQuery} The table element
         */
        var get_output_table = function ( el ) {
            var json = JSON.parse( el.text() );
            return sql_table.create_table_elem( json )
                .addClass( table_classes.join( ' ' ) );
        };

        /**
         * Render tables after "Wrong Answer" encountered.
         */
        var show_table = function () {
            var table_ctn = $( '<div>' )
                .append( '<hr>' )
                .append( $( '<div>' ).text( 'Inputs:' ) )
                .append( get_input_tables( $( input_id ) ) )

                .append( '<hr>' )
                .append( $( '<div class="pure-g">' )
                    .append( $( '<div class="pure-u-1-2">' )
                        .css( { color: 'red' } )
                        .append( $( '<div>' ).text( 'Output:' ) )
                        .append( get_output_table( $( output_id ) ) ) )
                    .append( $( '<div class="pure-u-1-2">' )
                        .css( { color: 'green' } )
                        .append( $( '<div>' ).text( 'Expected:' ) )
                        .append( get_output_table( $( expected_id ) ) ) ) );

            var wa_output = $( '#wa_output' );
            // remove prevous tables
            wa_output.children().first().nextAll().remove();
            wa_output.append( table_ctn );
        };

        /**
         * Render tables after "Runtime Error" encountered.
         */
        var show_le_table = function () {
            var table_ctn = $( '<div>' )
                .append( '<hr>' )
                .append( $( '<div>' ).text( 'Inputs:' ) )
                .append( get_input_tables( $( last_exe_id ) ) );

            var last_exe = $( '#last_executed_testcase_output_row' );
            // remove prevous tables
            last_exe.children().first().nextAll().remove();
            last_exe.append( table_ctn );
        };

        var create_show_table_btn = function () {
            var btn = $( '<button>' )
                .text( 'Tablize!' )
                .addClass( 'pure-button' )
                .css( { 'margin-left': '16px' } )
                .click( function () {
                    show_table();
                } );
            $( '#more-details' ).after( btn );
        };

        /**
         * Invoke callback when element is visible. Using MutationObserver
         * @param {jQuery} elem
         * @param {function} func
         */
        var setup_observer = function ( elem, func ) {
            var on_attr_changes = function () {
                if ( elem.is( ':visible' ) ) {
                    func();
                }
            };

            // elem may be visible already
            on_attr_changes();
            // observe style attribute changes
            var observer = new MutationObserver( on_attr_changes );
            observer.observe( elem.get( 0 ), { attributes: true } );
        };

        /**
         * Invoke callback when element is visible. Using setInterval()
         * @param {jQuery} elem
         * @param {function} func
         */
        var setup_poller = function ( elem, func ) {
            var is_showing = false;
            var check = function () {
                if ( elem.is( ':visible' ) ) {
                    if ( !is_showing ) {
                        func();
                        is_showing = true;
                    }
                } else {
                    is_showing = false;
                }
            };

            window.setInterval( check, 500 );
        };

        var setup;
        if ( !window.MutationObserver ) {
            setup = setup_poller;
        } else {
            setup = setup_observer;
        }

        // show tables after wrong answer appeared
        setup( $( '#wa_output' ), show_table );
        // show tables after a runtime errer
        setup( $( '#last_executed_testcase_output_row' ), show_le_table );
    };
    // END INCLUDE main.js


    bootstrap( main, {
        modules: [ {
            // jQuery
            url: '//cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js',
            has: function () {
                return window.jQuery;
            },
            get: function () {
                return window.$.noConflict();
            }
        }, {
            // underscore
            url: '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.8.3/underscore-min.js',
            has: function () {
                return undefined;
            },
            get: function () {
                return window._.noConflict();
            }
        }, {
            // sql_table
            has: function () {
                return sql_table;   // direct reference
            }
        } ],
        css: [
            // pure.css
            '//cdnjs.cloudflare.com/ajax/libs/pure/0.6.0/pure-min.css'
        ]
    } );

})();
