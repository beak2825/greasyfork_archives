
function OpenAll (){ 
    if($('option:selected').text().indexOf('全部')<0)
    {
        All();
    }
    else
    {
        var arr = $('a[target="_blank"]');
        
        if(arr.length==0){
            window.close();
        }
var varbool= confirm('是否选择已评阅');
        for (var i = 0; i < arr.length; i++) {
 
 if(varbool)
  window.open(arr.eq(i).attr('href'));
  else{
       if(arr.eq(i).text().indexOf('已评阅')<0)
      window.open(arr.eq(i).attr('href'));
  }
           
               
        }
    }
}//end
function All(){
    window.location= $('option:selected').val().replace('perpage=20','perpage=0');
}
function OpenPF (){
    var arr = $('td.c3 a.gradetheselink');
    if(arr.length==0){
        window.close();
    }
    for (var i = 0; i < arr.length; i++) {
        window.open(arr.eq(i).attr('href'));
    }
}
function KSDF () {
    $(document).ready(function() { 
        var inputs=$('#mform3 input');
        var ac=$('#mform3').attr('action');   
        var str_data=$('#mform3 input').map(function(){ 
            if($(this).attr("name"))
            {
                var name=$(this).attr("name");
                var vals=$(this).val();
                if(name.indexOf('quickgrade_')>=0) 
                {
                    var maxmark=$('#mod_assign_grading_r0_c5').text().split('/')[1];
                    var minmark=maxmark*0.9;
                    if(minmark>3)          
                        vals= randomNum(minmark,maxmark);
                    else
                        vals= maxmark;
                    var sss=name+'='+vals+'&'+name.replace('_','_comments_')+'='+'已阅';
                    return sss;
                }
                if(name.indexOf('selectedusers')>=0)
                    return;
                return (name+'='+vals); 
            }
        }).get().join("&");
        str_data=str_data+'&'+$('#id_sendstudentnotifications').attr("name")+'='+$('#id_sendstudentnotifications').val();
        $.ajax({             
            type: "post", 
            url: ac, 
            data: str_data, 
            success: function(msg){ 
                window.close();  
            }});  //ajax
    });   
}

function randomNum(minNum, maxNum) {
    switch (arguments.length) {
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
            break;
        case 2:
            return parseInt(Math.random() * ( maxNum - minNum + 1 ) + minNum, 10);
            //或者 Math.floor(Math.random()*( maxNum - minNum + 1 ) + minNum );
            break;
        default:
            return 0;
            break;
    }
} 
function LTPY () {
    'use strict';    
    var contextid=$('input[name="contextid"]').val();
    var itemid=$('input[name="itemid"]').val();
    var scaleid=$('input[name="scaleid"]').val();
    var rateduserid=$('input[name="rateduserid"]').val();
    var aggregation=$('input[name="aggregation"]').val();
    var sesskey=$('input[name="sesskey"]').val();  
    var minscaleid=scaleid*0.9;
    var rating=scaleid;
    if(minscaleid>3)
        rating=randomNum(minscaleid,scaleid);
    $.post('/rating/rate_ajax.php',{'contextid':contextid,'component': 'mod_forum', 'itemid': itemid ,'scaleid': scaleid ,'rateduserid': rateduserid ,'aggregation': aggregation ,'sesskey': sesskey,'rating': rating,'ratingarea':'post'},function(){window.close()})
    return minscaleid;
}
function pingfen(){
    var shengyu=$('#id_grade option:selected').text().split('(')[1].slice(0, -1);
    $('#manualgradingform').ready(function() { 
        var inputs=$('#manualgradingform input');
        var ac=$('#manualgradingform').attr('action');   
        var str_data=$('#manualgradingform input').map(function(){
            if($(this).attr("name")){
                var name=$(this).attr("name");
                var vals=$(this).val();
                if(name.indexOf('_-mark')>=0) {
                    var markstr='input[name="'+ $(this).attr("id").replace('mark','maxmark')+'"]';           
                    var maxmark=$(markstr).val();
                    var minmark=maxmark*0.9;
                    if(minmark>3)          
                        vals= randomNum(minmark,maxmark);
                    else
                        vals= maxmark;
                    var sss=name+'='+vals+'&'+name.replace('mark','comment')+'='+'已阅';
                    return sss;
                }      
                return (name+'='+vals); 
            }
        }).get().join("&"); 
        
        $.ajax({             
            type: "post", 
            url: ac, 
            data: str_data, 
            success: function(msg){ 
                if(shengyu>0)
                {
                    window.location.reload();  
                }
                else
                {
                    window.close(); 
                }
                
            }});  //ajax
    }); 
}