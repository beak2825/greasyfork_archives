(function(){
    //window.eva=eval;
    var debugflag = false;
    
    window.onload=function () {
        if (window.outerWidth - window.innerWidth > 210 ||window.outerHeight - window.innerHeight > 210) {
            try{
                $('#body').html('1检测到非法调试, 请关闭调试终端后刷新本页面重试!<br/>Welcome for People, Not Welcome for Machine!<br/>');
                debugflag = true;
            }catch(e){}
        }
        const handler = setInterval(() => {
            if (window.outerWidth - window.innerWidth > 210 ||window.outerHeight - window.innerHeight > 210) {
                try{
                    document.querySelector('html').innerHTML='2检测到非法调试, 请关闭调试终端后刷新本页面重试!<br/>Welcome for People, Not Welcome for Machine!<br/>';
                    debugflag = true;
                }catch(e){}
            }
            const before = new Date();
            (function() {}
             ["constructor"]("debugger")())
            const after = new Date();
            const cost = after.getTime() - before.getTime();
            if (cost > 50) {
                debugflag = true;
                try{
                    document.write('3检测到非法调试,请关闭调试终端后刷新本页面重试!<br/>Welcome for People, Not Welcome for Machine!<br/>');
                }catch(e){}
            }
        }, 1000)
    };

})()

