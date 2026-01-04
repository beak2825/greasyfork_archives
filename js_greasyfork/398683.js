// ==UserScript==
// @name         ChineseMooc Hotkey
// @namespace    http://shanqiaosong.com/
// @version      1.1
// @description  Add hotkeys to ChineseMooc
// @author       Qiaosong
// @match        http://www.chinesemooc.org/live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/398683/ChineseMooc%20Hotkey.user.js
// @updateURL https://update.greasyfork.org/scripts/398683/ChineseMooc%20Hotkey.meta.js
// ==/UserScript==

(function() {
    var rate=1
    var $fplayer=$('.fplayer')
    $('#container').append('<div id="infom" style="position:absolute;bottom:-30px;left:10px">已启用键盘控制</div>')
    function info(x){
        $('#infom').html(x)
    }
    $('html').bind('keydown',function(e){if(e.keyCode==190){
        fplayer.player.setVideoPlayRate(1.5)
        rate=1.5
        info('加速x1.5')
    }})
    $('html').bind('keyup',function(e){if(e.keyCode==190){
        fplayer.player.setVideoPlayRate(1)
        rate=1
        info('速度x1')
    }})
    $('html').bind('keydown',function(e){if(e.keyCode==191){
        fplayer.player.setVideoPlayRate(2)
        rate=2
        info('加速x2.0')
    }})
    $('html').bind('keyup',function(e){if(e.keyCode==191){
        fplayer.player.setVideoPlayRate(1)
        rate=1
        info('速度x1')
    }})
    $('html').bind('keydown',function(e){if(e.keyCode==97){
        fplayer.player.setVideoPlayRate(1)
        rate=1
        info('速度x1')
    }})
    $('html').bind('keydown',function(e){if(e.keyCode==98){
        fplayer.player.setVideoPlayRate(1.5)
        rate=1.5
        info('加速x1.5')
    }})
    $('html').bind('keydown',function(e){if(e.keyCode==99){
        fplayer.player.setVideoPlayRate(2)
        rate=2
        info('加速x2.0')
    }})
    $('html').bind('keydown',function(e){
        e.preventDefault()
        if(e.keyCode==32){
            if(fplayer.player.getVideoInfo().playing){
                fplayer.player.pauseVideo()
                info('暂停')
            }else{
                fplayer.player.resumeVideo()
                info('播放')
            }
        }
    })
    $('html').bind('keydown',function(e){
        e.preventDefault()
        if(e.keyCode==37){
            fplayer.player.seekVideo(fplayer.player.getVideoTime()-5)
            info('后退5s')
        }
    })
    $('html').bind('keydown',function(e){
        e.preventDefault()
        if(e.keyCode==39){
            fplayer.player.seekVideo(fplayer.player.getVideoTime()+5)
            info('前进5s')
        }
    })
    $('html').bind('keydown',function(e){
        e.preventDefault()
        if(e.keyCode==38){
            fplayer.player.setVideoVolume(fplayer.player.getVideoVolume()+0.1)
            info('音量+10%')
        }
    })
    $('html').bind('keydown',function(e){
        e.preventDefault()
        if(e.keyCode==40){
            fplayer.player.setVideoVolume(fplayer.player.getVideoVolume()-0.1)
            info('音量-10%')
        }
    })
    $('html').bind('keydown',function(e){
        e.preventDefault()
        if(e.keyCode==78){
            window.location.href='http://www.chinesemooc.org/live/'+(window.courseid+1)
            info('跳转到下一课程')
        }
    })
    $('html').bind('keydown',function(e){
        e.preventDefault()
        if(e.keyCode==76){
            window.location.href='http://www.chinesemooc.org/live/'+(window.courseid-1)
            info('跳转到上一课程')
        }
    })
    $('html').bind('keydown',function(e){
        e.preventDefault()
        if(e.keyCode==219){
            rate-=0.1
            fplayer.player.setVideoPlayRate(rate)
            info('速度x'+rate.toFixed(1))
        }
    })
    $('html').bind('keydown',function(e){
        e.preventDefault()
        if(e.keyCode==221){
            rate+=0.1
            fplayer.player.setVideoPlayRate(rate)
            info('速度x'+rate.toFixed(1))
        }
    })
    $('html').bind('keydown',function(e){
        e.preventDefault()
        if(e.keyCode==13){
            if ($fplayer.width()>900) 
    		{
                $(this).attr("data-full",0);
    			$fplayer.fullScreen(false);
    			$iconFrame.css({"visibility":"visible"});
    			$fplayer.css({"width":855,'left':oleft});//恢复
    		}
    		else
    		{
                $(this).attr("data-full",1);
    			oleft=$fplayer.css('left');
    			$fplayer.css({"width":"100%","left":0});
    			$iconFrame.css({"visibility":"hidden"});
    			$fplayer.fullScreen(true);
    		}
        }
    })
    

})();