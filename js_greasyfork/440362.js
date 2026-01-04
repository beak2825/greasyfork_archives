// ==UserScript==
// @name         S1 User Tagging
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  给stage1st加上标记用户/屏蔽用户帖子/修改用户帖子颜色/保存用户帖子
// @author       Hibino
// @include        http*://bbs.saraba1st.com/*
// @include        http*://www.saraba1st.com/*
// @require      https://code.jquery.com/jquery-3.1.1.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/440362/S1%20User%20Tagging.user.js
// @updateURL https://update.greasyfork.org/scripts/440362/S1%20User%20Tagging.meta.js
// ==/UserScript==


(function() {
    'use strict';

    var DATA_FILE = "s1_user_tags";
    var POST_URL = "/2b/forum.php?mod=redirect&goto=findpost&pid=";
    var HTML_USERNAME =
        '<div id="tgut_pid_PID" class="tgut" data-uid="UID" data-pid="PID" >' +
        '<div class="t">S1UT</div>' +
        '<div class="m">' +
        '<div class="tag">标签：<input class="in" type="text" name="tag" value="TAG" /></div>' +
        '<div class="colors">' +
        '<div class="c c1 f"></div>' +
        '<div class="c c2"></div>' +
        '<div class="c c3"></div>' +
        '<div class="c c4"></div>' +
        '<div class="c c5 f"></div>' +
        '<div class="c c6"></div>' +
        '<div class="c c7"></div>' +
        '<div class="c c8"></div>' +
        '<div class="c c9 f"></div>' +
        '<div class="c c10"></div>' +
        '<div class="c c11"></div>' +
        '<div class="c c12"></div>' +
        '<div class="tgut-clear"></div></div>' +
        '<div class="clor">颜色：<input class="in" type="text" name="color" value="COLOR" /></div>' +
        '<div class="remv"><label><input type="checkbox" name="remove_post" value="1" REMOVE_POST>隐藏该用户帖子</label></div>' +
        '<button class="but but-save-tag" type="button" name="dummy" value="Save" data-pid="PID">保存</button>' +
        '<hr>' +
        '<button class="but but-save-post" type="button" name="dummy" value="Save Post" data-pid="PID" data-uid="UID">保存帖子</button>' +
        '&nbsp;&nbsp;&nbsp;&nbsp;' +
        '<button class="but but-view-posts" type="button" name="dummy" value="Save Post" data-pid="PID" data-uid="UID">查看帖子</button>' +
        '</div>' +
        '</div>';
    var HTML_TAG = '<div class="tgut-tag">TAG</div>';
    var HTML_MSG = '<div id="tgut_msg" class="tgut-msg"></div>';
    var HTML_POPUP =
        '<div class="tgut-page-cover" id="tgut_page_cover"></div>' +
        '<div class="tgut-popup" id="tgut_popup">' +
        '<div class="tt"><div class="f-l" id="tgut_popup_title">&nbsp;</div><div class="f-r cls" id="tgut_popup_close"><a>X</a></div><div class="tgut-clear"></div></div>' +
        '<div class="ct" id="tgut_popup_content"></div>' +
        '</div>';
    var HTML_SETTINGS =
        '<div id="tgut_settings" class="tgut-sett">'+
        '<div class="b"><button class="but but-clean" type="button" name="dummy" value="Clean">清除数据</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
        '<button class="but but-export" type="button" name="dummy" value="Export">导出数据</button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' +
        '<button class="but but-import" type="button" name="dummy" value="Import">导入数据</button></div>'+
        '<div class="t">导出时请保存下框的所有文本数据。导入时请把文本数据复制到下框然后点击“导入数据”按钮' +
        '<br /><textarea id="tgut_data_text" class="txa" name="dummy"></textarea></div>' +
        '</div>';

    GM_addStyle(
        `
.tgut-clear{
    clear: both;
}
.tgut-blur{
    filter: blur(20px);
}
.tgut{
    top: 0;
    right: 0;
    position: absolute;
    font-weight: normal;
}
.tgut:hover{
}
.tgut-msg{
    display: none;
    position: fixed;
    width: 300px;
    padding: 5px 10px;
    top: 0;
    left: 50%;
    margin-left: -150px;
    color: #ffffff;
    text-align: center;
    background: #0033cc;
    z-index: 300;
}
.tgut .t{
    display: block;
    padding: 2px 5px;
    color: #ffffff;
    background: #006cc2;
    cursor: pointer;
}
.tgut .m{
    display: none;
    position: absolute;
    width: 145px;
    right: 0;
    padding: 5px;
    color: #444444;
    text-align: right;
    border: 3px solid #006cc2;
    background: #ffffff;
    z-index: 100;
}
.tgut:hover .m{
    display: block;
}
.tgut .in{
    width: 95px;
}
.tgut .but{
    color: #ffffff;
    border: 0;
    background: #006cc2;
}
.tgut .tag{
    margin: 0 0 10px;
}
.tgut .colors{
    margin: 0 0 10px;
}
.tgut .clor{
    margin: 0 0 10px;
}
.tgut .remv{
    margin: 0 0 10px;
}
.tgut .colors .c{
    float: right;
    width: 32px;
    height: 32px;
    margin: 0;
}
.tgut .colors .f{
    margin-right: 0;
}
.tgut .colors .c1{
    background: #641e16;
}
.tgut .colors .c2{
    background: #4a235a;
}
.tgut .colors .c3{
    background: #0b5345;
}
.tgut .colors .c4{
    background: #7d6608;
}
.tgut .colors .c5{
    background: #424949 ;
}
.tgut .colors .c6{
    background: #e74c3c;
}
.tgut .colors .c7{
    background: #f7dc6f;
}
.tgut .colors .c8{
    background: #85929e;
}
.tgut .colors .c9{
    background: #17a589 ;
}
.tgut .colors .c10{
    background: #f0b27a;
}
.tgut .colors .c11{
    background: #000000;
}
.tgut .colors .c12{
    background: #00ff00;
}
.tgut-tag{
    position: absolute;
    width: 130px;
    margin: 8px 0;
    color: #ffffff;
    text-align: center;
    line-height: 24px;
    border: 0;
    background: #006cc2;
    z-index: 50;
}
.tgut-page-cover{
    display: none;
    position:absolute;
    top: 0;
    left: 0;
    -moz-opacity: 0.6;
    opacity: 0.6;
    background-color: #000000;
    z-index: 200;
}
.tgut-popup{
    position: absolute;
    display: none;
    left: 50%;
    top: 10%;
    width: 60%;
    background: #ffffff;
    border: 5px solid #006cc2;
    z-index: 250;
}
.tgut-popup .f-l{
    float: left;
}
.tgut-popup .f-r{
    float: right;
}
.tgut-popup .tt{
    padding: 0 10px;
    line-height: 28px;
    color: #ffffff;
    background: #006cc2;
}
.tgut-popup .cls{
}
.tgut-popup .cls a{
    display: block;
    width: 24px;
    float: right;
    font-size: 120%;
    color: #fff;
    line-height: 24px;
    cursor: pointer;
    text-align: center;
    text-decoration: none;
}
.tgut-popup .cls a:hover{
    color: #0e5685;
    background: #fff;
}
.tgut-popup .ct{
    clear: both;
    __padding: 5px;
    text-align: left;
}
.tgut-posts{
    padding: 10px;
}
.tgut-posts .post{
    clear: both;
    margin: 10px 0 20px 0;
    padding: 10px;
    background: #f0f0f0;
    border-bottom: 2px solid #006cc2;
    overflow: hidden;
}
.tgut-posts .pid{
    float: right;
    margin: 0 20px 0 0;
    font-weight: bold;
    text-decoration: underline;
}
.tgut-posts .time{
    float: left;
    font-weight: bold;
}
.tgut-posts .del{
    float: right;
}
.tgut-posts .del button{
    color: #ffffff;
    border: 0;
    background: #006cc2;
}
.tgut-posts .ct{
    clear: both;
    margin: 10px 0;
}
.tgut-but{
    display: inline-block;
    margin: 4px 20px;
    padding: 0 10px;
    color: #ffffff;
    line-height: 25px;
    background: #006cc2;
    cursor: pointer;
}
.tgut-sett{
    padding: 10px;
}
.tgut-sett .but{
    color: #ffffff;
    border: 0;
    background: #006cc2;
}
.tgut-sett .b{
    text-align: right;
}
.tgut-sett .t{
    margin: 20px 0;
}
.tgut-sett .t .txa{
    width: 99%;
    height: 200px;
}
        `
    );

    $( 'body' ).append( HTML_MSG );
    $( 'body' ).append( HTML_POPUP );


    function test( v ){
        return ( v && v !== 0 && v != "0" );
    }
    function trim( txt ){
        return ( txt ? txt.replace( /^\s+|\s+$/g, "" ) : "" );
    }
    function html( s ){
        if( typeof s == 'string' ){
            return s.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
        }
        return '';
    }
    function count_obj( o, true_only ){
        var c = 0;
        for( var i in o ){
            true_only ? ( test( o[i] ) && c++ ) : c++;
        }
        return c;
    }
    function tl( o ){
        console.log( o );
    }


    var tg = {

        is_logged_in: 0,
        data_init: {
            version: 2,
            users: {},
            posts: {},
        },
        user_init: {
            uid: 0,
            name: '',
            tag: '',
            color: '',
            remove_post: 0,
            parent_uid: 0,
            related_uids: {},
            quotes: {}
        },
        data: {},

        msg: function( m ){
            $( '#tgut_msg' ).html( m ).stop( true, true ).show( 1, function(){ $( '#tgut_msg' ).animate( {"null":1}, 1000 ).fadeOut( 200 ); } );
        },

        load_data: function(){
            var data = tg.data_init;
            var tmp = GM_getValue( DATA_FILE, "" );

            try{
                data = JSON.parse( tmp );
            }catch( e ){

            }
            if( test( data.version ) ){
                tg.data = data;
            }
        },
        save_data: function(){
            GM_setValue( DATA_FILE, JSON.stringify( tg.data ) );
        },
        clean_data: function(){
            tg.data = tg.data_init;
            tg.save_data();
        },
        update_data: function(){
            if( tg.data.version < 2 ){
                tg.data.posts = {};
                tg.data.version = 2;
                tg.save_data();
            }
        },

        init: function(){
            // check if logged in
            var l = $( '#um' );
            if( l.length > 0 ){
                tg.is_logged_in = 1;
                // read in stored settings
                tg.load_data();
                tg.update_data();

                post.init();
                sett.init();
            }else{
                // do nothing...
            }

            pop.init();
        }

    };

    var pop = {

        cover: function( on ){
            var c = $( '#tgut_page_cover' );
            var o = $( 'body' );
            if( on ){
                c.css( "width", o.width() ).css( "height", o.height() ).show();
                o.find( '.wrap:first' ).addClass( "tgut-blur" );
            }else{
                o.find( '.wrap:first' ).removeClass( "tgut-blur" );
                c.hide();
            }

        },

        show: function( t, c ){
            var o = $( '#tgut_popup' );
            var top = $(document).scrollTop() + ( o.height() > 500 ? 1 : 100 );
            $( '#tgut_popup_content' ).html( c );
            $( '#tgut_popup_title' ).html( ( t ) );
            o.css( "margin-left", - o.width() / 2 ).css( "top", top ).show();
            pop.cover( 1 );
        },
        close: function(){
            $( '#tgut_popup' ).hide();
            pop.cover();
        },

        init: function(){
            $( '#tgut_popup_close' ).click( pop.close );
        }
    };


    var post = {

        process_posts: function(){
            $( "#postlist" ).children( 'div' ).each(
                function(){
                    var o = $( this );
                    if( o.prop( 'id' ).indexOf( 'post_' ) == 0 ){
                        var user = o.find( ".authi:first" ).css( "position", "relative" );
                        var popup = o.find( ".userinfopanel" );
                        o.find( '.pls' ).css( 'overflow', 'visible' );
                        o.find( '.tgut' ).remove();
                        user.parent().css( 'overflow', 'visible' )

                        var name = user.find( "a" ).html();
                        var uid = post.get_uid( user );
                        var pid = o.find( "table" ).first().prop( "id" ).replace( "pid", "" );

                        //tl( username + ":::" + uid + ":::" + pid );
                        var tag = test( tg.data.users[uid] ) ? tg.data.users[uid] : tg.user_init;
                        var h = HTML_USERNAME;
                        h = h.replace( /PID/g, pid )
                            .replace( /UID/g, uid )
                            .replace( /TAG/g, html( tag.tag ) )
                            .replace( /COLOR/g, html( tag.color ) )
                            .replace( /REMOVE_POST/g, ( test( tag.remove_post ) ? 'checked' : '' ) );
                        var j = new $( h );
                        j.find( ".but-save-tag" ).click( post.save );
                        j.find( ".but-save-post" ).click( post.save_post );
                        j.find( ".but-view-posts" ).click( post.view_posts );
                        j.find( ".c" ).click( post.color_click );
                        user.append( j );

                        if( tag.uid == uid ){
                            user.parent().find( '.tgut-tag' ).remove();
                            if( test( tag.tag ) ){
                                user.after( HTML_TAG.replace( /TAG/g, html( tag.tag ) ) );
                            }
                            user.closest( 'table' ).find( 'td' ).css( 'color', '' );
                            if( test( tag.color ) ){
                                user.closest( 'table' ).find( 'td' ).css( 'color', tag.color );
                            }
                            var s = o.find( 'favatar:first' );
                            if( test( tag.remove_post ) ){
                                //s.children("div:gt(0), p, dl, ul").css( 'display', 'none' );
                                o.find( '.pct' ).css( 'display', 'none' ).after( '<div class="tgut-mesg">用户帖子和签名被屏蔽</div>' );
                                o.find( '.sign' ).css( 'display', 'none' );
                            }else{
                                //s.children("div:gt(0), p, dl, ul").css( 'display', 'block' );
                                o.find( '.pct' ).css( 'display', 'block' );
                                o.find( '.sign' ).css( 'display', 'none' );
                                o.find( '.tgut-mesg' ).remove();
                            }
                        }
                    }
                }
            );
        },
        get_uid: function( d  ){
            var h = d.find( 'a' ).prop( 'href' );
            var s = h.substring( h.lastIndexOf( "-" ) + 1, h.lastIndexOf( '.html' ) );
            return trim( s );
        },
        get_name: function( pid ){
            var name = $( '#pid' + pid ).find( 'cite:first' ).find( "a" ).html();
            return trim( name );
        },
        color_click: function( e ){
            var o = $( this );
            o.closest( ".tgut" ).find( "[name='color']" ).val( o.css( "background-color" ) );

        },
        save: function( e ){
            var o = $( this ).closest( ".tgut" );
            var uid = o.data( "uid" );
            var pid = o.data( "pid" );
            var tag = o.find( "[name='tag']" ).val();
            var color = o.find( "[name='color']" ).val();
            var remove_post = o.find( "[name='remove_post']" ).is( ':checked' );
            if( !test( uid ) ){
                return;
            }
            if( !test( tg.data.users[uid] ) ){
                tg.data.users[uid] = tg.user_init;
            }
            tg.data.users[uid].uid = uid;
            tg.data.users[uid].tag = tag;
            tg.data.users[uid].name = post.get_name( pid );
            tg.data.users[uid].color = color;
            tg.data.users[uid].remove_post = remove_post ? 1 : 0;
            tg.save_data();
            tg.msg( "已保存用户标签" );
            post.process_posts();
        },
        save_post: function( e ){
            var o = $( this );
            var pid = o.data( 'pid' );
            var uid = o.data( 'uid' );
            var content = trim( $( '#postmessage_' + pid ).html() );
            var time_str = trim( $( '#authorposton' + pid ).text() ); // well well well....

            if( !test( tg.data.posts[uid] ) ){
                tg.data.posts[uid] = {};
            }
            tg.data.posts[uid][pid] = {
                'uid': uid,
                'pid': pid,
                'name': post.get_name( pid ),
                'time': time_str,
                'post': content
            };

            tg.save_data();
            tg.msg( "帖子保存了" );

        },
        del_post: function( e ){
            var o = $( this );
            var pid = o.data( 'pid' );
            var uid = o.data( 'uid' );

            if( test( tg.data.posts[uid] )  && test( tg.data.posts[uid][pid] ) ){
                delete( tg.data.posts[uid][pid] );
                tg.save_data();
                tg.msg( "帖子删除了" );
            }

            $( '#tgut_post_' + pid ).remove();
            if( !count_obj( tg.data.posts[uid] ) ){
                pop.close();
            }

        },
        view_posts: function( e ){
            var o = $( this );
            var pid = o.data( 'pid' );
            var uid = o.data( 'uid' );

            if( !test( tg.data.posts[uid] ) || !count_obj( tg.data.posts[uid] ) ){
                tg.msg( '没有针对该用户保存的帖子' );
                return;
            }

            var name = '';
            var h = '<div class="tgut-posts">';
            for( var i in tg.data.posts[uid] ){
                var p = tg.data.posts[uid][i];
                name = p.name;
                h += '<div class="post" id="tgut_post_' +p.pid+ '"><div class="time">' +p.time+ '</div>' +
                    '<div class="del"><button class="but" name="dummy" value="Del" data-pid="' +p.pid+ '" data-uid="' +p.uid+ '">删除</button></div>' +
                    '<div class="pid"><a href="' +POST_URL+p.pid+ '" target="_blank">Post ID: ' +p.pid+ '</a></div>' +
                    '<div class="ct">' +p.post+ '</div></div>';
            }
            h += '</div>';
            var j = new $( h );
            j.find( '.but' ).click( post.del_post );
            pop.show( name, j );
        },

        init: function(){
            post.process_posts();
        }

    };


    var sett = {

        clean: function(){
            if( confirm( "确定删除所有以保存的用户标签以及帖子吗？" ) ){
                tg.clean_data();
                tg.save_data();
                tg.init();
                tg.msg( "数据已清除" );
            }
        },
        export: function(){
            var str = JSON.stringify( tg.data );
            $( '#tgut_data_text' ).val( str );
            tg.msg( "数据已显示在输入框中" );
        },
        import: function(){
            var data = {};
            var str = trim( $( '#tgut_data_text' ).val() );
            try{
                data = JSON.parse( str );
            }catch( e ){
                tg.msg( "数据不是有效的JSON字串" );
                return;
            }
            if( test( data.version ) ){
                tg.data = data;
                tg.update_data();
                tg.save_data();
                tg.msg( "成功导入数据" );
                tg.init();
            }else{
                tg.msg( "无法识别数据版本" );
            }
        },
        show: function(){
            var j = new $( HTML_SETTINGS );
            j.find( '.but-clean' ).click( sett.clean );
            j.find( '.but-export' ).click( sett.export );
            j.find( '.but-import' ).click( sett.import );
            pop.show( 'S1UT设置', j );
        },

        init: function(){
            // find the user bar beside the log
            var o = $( '#nv' ).find( 'ul' );
            if( !o.find( '.tgut-but' ).length ){
                var j = new $( '<div class="tgut-but">S1UT</div>' );
                j.click( sett.show );
                o.parent().append( j );
            }
        }
    };


    tg.init();

})();