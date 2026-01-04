var localurl = location.href;
    function addbtn(){
        var btn = '<button id="getlitbtn" style="color: white;margin-left:20px;background-color: red;border: none;padding: 5px 10px;">提取群成员</button>';
        $('.group-tit').append(btn);
        $('#getlitbtn').click(run);
    }

    function addstatus(){
        var s = '<div id="getliststatus" style=" position: fixed; top: 50%; left: 50%;  background-color: black;  color: white;  padding: 20px;  font-size: 20px;  opacity: 70%;  border-radius: 5px;">提取群成员中... </div>';
        $('body').append(s);
    }
    function changestatus(n,t){
        document.querySelector('#getliststatus').innerText = `提取群成员中(${n}/${t})...`;
    }

    function adddownloadbtn(srcdata){
        var blob = new Blob(["\ufeff" + srcdata], {type: 'text/csv'});
        var btn = `<a id="numlistdl" class="btn" style="margin-left:20px;" href="${URL.createObjectURL(blob)}" download="${document.querySelector('#groupTit').innerText+'/'+new Date(new Date().getTime()).toLocaleDateString()}.csv">下载CSV</a>`;
        $('.group-tit').append(btn);
    }
    function showlist(){
        //console.log('showlist');
        var totalnum = parseInt(document.querySelector('#groupMemberNum').innerText);
        var num = document.querySelectorAll('tr.mb').length;
        //console.log('totalnum:',totalnum,' num get:',num);
        changestatus(num,totalnum);
        if(num<totalnum){
            scrollTo(0,document.documentElement.scrollHeight);
            setTimeout(showlist,500);
        }else{
            document.querySelector('#getliststatus').remove();
            //var nlist = getlist();
            var csvinfo = getcsvinfo();
            //console.log(csvinfo);
            scrollTo(0,0);
            adddownloadbtn(csvinfo);
        }
    }

    function getlist(){
        console.log('getlist')
        var nlist = document.querySelectorAll('tr.mb');
        var res=[];
        for(var i=0;i<nlist.length;i++){
            res.push(document.querySelectorAll('tr.mb')[i].className.match(/(\d.*)/)[0])
        }
        return res
    }
    // Your code here...
    function run(){
        addstatus();
        console.log('run')
        if(document.querySelectorAll('tr.mb').length>0){
            showlist();

        }else{
        setTimeout(run,500)
        }
    }
    function getcsvinfo(){
        var csvinfolist=[];
        var trs = document.querySelectorAll('tr');
        for(var i=0;i<trs.length;i++){
            var memberinfolist=[];
            var member = trs[i].children;
            for(var j=0;j<member.length;j++){
                memberinfolist.push(member[j].innerText);
            }
            csvinfolist.push(memberinfolist.join(','))
        }
        return csvinfolist.join('\n');
    }
    function checkurl(){
    if(location.href!==localurl){
        if(document.querySelectorAll('#numlistdl').length>0){document.querySelector('#numlistdl').remove();}
        localurl = location.href;
        checkurl();
    }else{
        
        setTimeout(checkurl,500);
    }
    }
    addbtn();
    checkurl();