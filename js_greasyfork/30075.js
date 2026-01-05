// ==UserScript==
// @name         xóa từ
// @version      2.8.5
// @description  make life easier
// @author       P
// @include      https://www3.chotot.com/*
// @exclude      https://www3.chotot.com/controlpanel?lock=1&m=adqueue&a=show_adqueues&queue=other_projects
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/110837
// @downloadURL https://update.greasyfork.org/scripts/30075/x%C3%B3a%20t%E1%BB%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/30075/x%C3%B3a%20t%E1%BB%AB.meta.js
// ==/UserScript==


var res1,res2,string1,string2,re,congthuc;
var soad= document.getElementsByName("body").length;

//xóa tiêu đề//
function xoatieude(tucanxoa)
{
    re = new RegExp(tucanxoa, "gi"); //g (chính xác) hoặc gi (gần giống)
    var i=0;
	//ngoại lệ
    /*if(tucanxoa=="bán")
    {
        congthuc=tucanxoa+"\(\?\! thời\| hàng\|h\)";
        re = new RegExp(congthuc, "gi");
        while(i<soad)
        {
            string1 = document.getElementsByName("subject")[i].value;
            res1 = string1.replace(re, "");
            document.getElementsByName("subject")[i].value = res1;
            i++;
        }
    }
    else
    {
        if(tucanxoa=="cần")
        {
            congthuc=tucanxoa+"\(\?\! thơ\| giuộc\| câu\| đước\)";
            re = new RegExp(congthuc, "gi");
            while(i<soad)
            {
            string1 = document.getElementsByName("subject")[i].value;
            res1 = string1.replace(re, "");
            document.getElementsByName("subject")[i].value = res1;
            i++;
            }
        }
        else
        {
                while(i<soad)
                {
                    string1 = document.getElementsByName("subject")[i].value;
                    res1 = string1.replace(re, "");
                    document.getElementsByName("subject")[i].value = res1;
                    i++;
                }
        }

    }*/
	switch(tucanxoa)
	{
		case "bán":
			congthuc=tucanxoa+"\(\?\! thời\| hàng\|h\)";
			re = new RegExp(congthuc, "gi");
			while(i<soad)
			{
            string1 = document.getElementsByName("subject")[i].value;
            res1 = string1.replace(re, "");
            document.getElementsByName("subject")[i].value = res1;
            i++;
			}
			break;
		case "cần":
			congthuc=tucanxoa+"\(\?\! thơ\| giuộc\| câu\| đước\)";
            re = new RegExp(congthuc, "gi");
            while(i<soad)
            {
            string1 = document.getElementsByName("subject")[i].value;
            res1 = string1.replace(re, "");
            document.getElementsByName("subject")[i].value = res1;
            i++;
            }
			break;
		case "giá":
			congthuc=tucanxoa+"\(\?\!o\|p\|m\)";
            re = new RegExp(congthuc, "gi");
            while(i<soad)
            {
            string1 = document.getElementsByName("subject")[i].value;
            res1 = string1.replace(re, "");
            document.getElementsByName("subject")[i].value = res1;
            i++;
            }
			break;
		case "rẻ":
			while(i<soad)
			{
				string1 = document.getElementsByName("subject")[i].value;
				res1 = string1.replace(/(t)?rẻ/gi, function($0,$1){ return $1?$0:"";});
				document.getElementsByName("subject")[i].value = res1;
				i++;
			}
			break;
		case "tiền":
		    while(i<soad)
            {
                string2 = document.getElementsByName("subject")[i].value;
                res2 = string2.replace(/(mặt |mặt)?tiền/gi, function($0,$1){ return $1?$0:"";});
                document.getElementsByName("subject")[i].value = res2;
            }
            break;
		default:
			 while(i<soad)
                {
                    string1 = document.getElementsByName("subject")[i].value;
                    res1 = string1.replace(re, "");
                    document.getElementsByName("subject")[i].value = res1;
                    i++;
                }
			break;
	}

}
//xóa nội dung//
function xoaca2(tucanxoa)
{
    re = new RegExp(tucanxoa, "gi"); //g (chính xác) hoặc gi (gần giống)
    var i=0;
    while(i<soad)
    {
        string2 = document.getElementsByName("subject")[i].value;
        res2 = string2.replace(re, "");
        document.getElementsByName("subject")[i].value = res2;
        string2 = document.getElementsByName("body")[i].value;
        res2 = string2.replace(re, "");
        document.getElementsByName("body")[i].value = res2;
        i++;
    }
}
function xoatunhat()
{
    /*function escapeRegExp(str)
    {
        return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
    }
    Example
    escapeRegExp("All of these should be escaped: \ ^ $ * + ? . ( ) | { } [ ]");
    >>> "All of these should be escaped: \\ \^ \$ \* \+ \? \. \( \) \| \{ \} \[ \] "*/

    var i=0;
    while(i<soad)
    {
        string2 = document.getElementsByName("subject")[i].value;
        res2 = string2.replace(/(thống |sơn )?nhất/gi, function($0,$1){ return $1?$0:"";});
        document.getElementsByName("subject")[i].value = res2;
        string2 = document.getElementsByName("body")[i].value;
        res2 = string2.replace(/(thống |sơn )?nhất/gi, function($0,$1){ return $1?$0:"";});
        document.getElementsByName("body")[i].value = res2;
        i++;
    }
}
function xoasdt()
{
  var i=0;
  while(i<soad)
  {
      //+84//
      string1 = document.getElementsByName("subject")[i].value;
      res1 = string1.replace(/[+841]\s*[-. (]*(\d{2})[-. )]*(\d{4})[-. ]*(\d{4})(?: *x(\d+))?\s*/gi, "");
      document.getElementsByName("subject")[i].value = res1;
      string2 = document.getElementsByName("body")[i].value;
      res2 = string2.replace(/[+841]\s*[-. (]*(\d{2})[-. )]*(\d{4})[-. ]*(\d{4})(?: *x(\d+))?\s*/gi, "");
      document.getElementsByName("body")[i].value = res2;
      ////
       string1 = document.getElementsByName("subject")[i].value;
      res1 = string1.replace(/[+849|+848]\s*[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{3})(?: *x(\d+))?\s*/gi, "");
      document.getElementsByName("subject")[i].value = res1;
      string2 = document.getElementsByName("body")[i].value;
      res2 = string2.replace(/[+849|+848]\s*[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{3})(?: *x(\d+))?\s*/gi, "");
      document.getElementsByName("body")[i].value = res2;
      ////
      string1 = document.getElementsByName("subject")[i].value;
      res1 = string1.replace(/[01]\s*[-. (]*(\d{2})[-. )]*(\d{4})[-. ]*(\d{4})(?: *x(\d+))?\s*/gi, "");
      document.getElementsByName("subject")[i].value = res1;
      string2 = document.getElementsByName("body")[i].value;
      res2 = string2.replace(/[01]\s*[-. (]*(\d{2})[-. )]*(\d{4})[-. ]*(\d{4})(?: *x(\d+))?\s*/gi, "");
      document.getElementsByName("body")[i].value = res2;

      string1 = document.getElementsByName("subject")[i].value;
      res1 = string1.replace(/[09|08]\s*[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{3})(?: *x(\d+))?\s*/gi, "");
      document.getElementsByName("subject")[i].value = res1;
      string2 = document.getElementsByName("body")[i].value;
      res2 = string2.replace(/[09|08]\s*[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{3})(?: *x(\d+))?\s*/gi, "");
      document.getElementsByName("body")[i].value = res2;
      
      i++;
  }
}

function xoagia()
{
    var i=0;
    while(i<soad)
    {
        string1 = document.getElementsByName("subject")[i].value;

        //****tỷ****//
        if(string1.search(/tỷ/gi)>-1)
        {
            res1 = string1.replace(/\d\d\d\W\d\stỷ/gi, "");
            res1 = res1.replace(/\d\d\W\d\stỷ/gi, "");
            res1 = res1.replace(/\d\d\W\d\d\stỷ/gi, "");
            res1 = res1.replace(/\d\W\d\d\stỷ/gi, "");
            res1 = res1.replace(/\d\W\d\stỷ/gi, "");
            res1 = res1.replace(/\d\d\d\stỷ/gi, "");
            res1 = res1.replace(/\d\d\stỷ/gi, "");
            res1 = res1.replace(/\d\stỷ/gi, "");

            res1 = res1.replace(/\d\d\d\W\dtỷ/gi, "");
            res1 = res1.replace(/\d\d\W\dtỷ/gi, "");
            res1 = res1.replace(/\d\W\dtỷ/gi, "");

            res1 = res1.replace(/\d\d\dtỷ/gi, "");
            res1 = res1.replace(/\d\dtỷ/gi, "");
            res1 = res1.replace(/\dtỷ/gi, "");

            res1 = res1.replace(/\d\dtỷ\d\d/gi, "");
            res1 = res1.replace(/\d\dtỷ\d/gi, "");
            res1 = res1.replace(/\dtỷ\d\d/gi, "");
            res1 = res1.replace(/\dtỷ\d/gi, "");



            document.getElementsByName("subject")[i].value = res1;
        }
        //****ty****//
        if(string1.search(/ty/gi)>-1)
        {
            res1 = string1.replace(/\d\d\d\W\d\sty/gi, "");
            res1 = res1.replace(/\d\d\W\d\sty/gi, "");
            res1 = res1.replace(/\d\d\W\d\d\sty/gi, "");
            res1 = res1.replace(/\d\W\d\d\sty/gi, "");
            res1 = res1.replace(/\d\W\d\sty/gi, "");
            res1 = res1.replace(/\d\d\d\sty/gi, "");
            res1 = res1.replace(/\d\d\sty/gi, "");
            res1 = res1.replace(/\d\sty/gi, "");

            res1 = res1.replace(/\d\d\d\W\dty/gi, "");
            res1 = res1.replace(/\d\d\W\dty/gi, "");
            res1 = res1.replace(/\d\W\dty/gi, "");

            res1 = res1.replace(/\d\d\dty/gi, "");
            res1 = res1.replace(/\d\dty/gi, "");
            res1 = res1.replace(/\dty/gi, "");

            res1 = res1.replace(/\d\dty\d\d/gi, "");
            res1 = res1.replace(/\d\dty\d/gi, "");
            res1 = res1.replace(/\dty\d\d/gi, "");
            res1 = res1.replace(/\dty\d/gi, "");



            document.getElementsByName("subject")[i].value = res1;
        }
        //****tỉ****//
        if(string1.search(/tỉ/gi)>-1)
        {
            res1 = string1.replace(/\d\d\d\W\d\stỉ/gi, "");
            res1 = res1.replace(/\d\d\W\d\stỉ/gi, "");
            res1 = res1.replace(/\d\d\W\d\d\stỉ/gi, "");
            res1 = res1.replace(/\d\W\d\d\stỉ/gi, "");
            res1 = res1.replace(/\d\W\d\stỉ/gi, "");
            res1 = res1.replace(/\d\d\d\stỉ/gi, "");
            res1 = res1.replace(/\d\d\stỉ/gi, "");
            res1 = res1.replace(/\d\stỉ/gi, "");

            res1 = res1.replace(/\d\d\d\W\dtỉ/gi, "");
            res1 = res1.replace(/\d\d\W\dtỉ/gi, "");
            res1 = res1.replace(/\d\W\dtỉ/gi, "");

            res1 = res1.replace(/\d\d\dtỉ/gi, "");
            res1 = res1.replace(/\d\dtỉ/gi, "");
            res1 = res1.replace(/\dtỉ/gi, "");

            res1 = res1.replace(/\d\dtỉ\d\d/gi, "");
            res1 = res1.replace(/\d\dtỉ\d/gi, "");
            res1 = res1.replace(/\dtỉ\d\d/gi, "");
            res1 = res1.replace(/\dtỉ\d/gi, "");



            document.getElementsByName("subject")[i].value = res1;
        }
        //****ti****//
        if(string1.search(/ti/gi)>-1)
        {
            res1 = string1.replace(/\d\d\d\W\d\sti/gi, "");
            res1 = res1.replace(/\d\d\W\d\sti/gi, "");
            res1 = res1.replace(/\d\d\W\d\d\sti/gi, "");
            res1 = res1.replace(/\d\W\d\d\sti/gi, "");
            res1 = res1.replace(/\d\W\d\sti/gi, "");
            res1 = res1.replace(/\d\d\d\sti/gi, "");
            res1 = res1.replace(/\d\d\sti/gi, "");
            res1 = res1.replace(/\d\sti/gi, "");

            res1 = res1.replace(/\d\d\d\W\dti/gi, "");
            res1 = res1.replace(/\d\d\W\dti/gi, "");
            res1 = res1.replace(/\d\W\dti/gi, "");

            res1 = res1.replace(/\d\d\dti/gi, "");
            res1 = res1.replace(/\d\dti/gi, "");
            res1 = res1.replace(/\dti/gi, "");

            res1 = res1.replace(/\d\dti\d\d/gi, "");
            res1 = res1.replace(/\d\dti\d/gi, "");
            res1 = res1.replace(/\dti\d\d/gi, "");
            res1 = res1.replace(/\dti\d/gi, "");

            document.getElementsByName("subject")[i].value = res1;
        }
        //****triệu****//
        if(string1.search(/triệu/gi)>-1)
        {
            res1 = string1.replace(/\d\d\d\W\d\striệu/gi, "");
            res1 = res1.replace(/\d\d\W\d\striệu/gi, "");
            res1 = res1.replace(/\d\d\W\d\d\striệu/gi, "");
            res1 = res1.replace(/\d\W\d\d\striệu/gi, "");
            res1 = res1.replace(/\d\W\d\striệu/gi, "");
            res1 = res1.replace(/\d\d\d\striệu/gi, "");
            res1 = res1.replace(/\d\d\striệu/gi, "");
            res1 = res1.replace(/\d\striệu/gi, "");

            res1 = res1.replace(/\d\d\d\W\dtriệu/gi, "");
            res1 = res1.replace(/\d\d\W\dtriệu/gi, "");
            res1 = res1.replace(/\d\W\dtriệu/gi, "");

            res1 = res1.replace(/\d\d\dtriệu/gi, "");
            res1 = res1.replace(/\d\dtriệu/gi, "");
            res1 = res1.replace(/\dtriệu/gi, "");

            res1 = res1.replace(/\d\dtriệu\d\d/gi, "");
            res1 = res1.replace(/\d\dtriệu\d/gi, "");
            res1 = res1.replace(/\dtriệu\d\d/gi, "");
            res1 = res1.replace(/\dtriệu\d/gi, "");



            document.getElementsByName("subject")[i].value = res1;
        }
        //****trieu****//
        if(string1.search(/trieu/gi)>-1)
        {
            res1 = string1.replace(/\d\d\d\W\d\strieu/gi, "");
            res1 = res1.replace(/\d\d\W\d\strieu/gi, "");
            res1 = res1.replace(/\d\d\W\d\d\strieu/gi, "");
            res1 = res1.replace(/\d\W\d\d\strieu/gi, "");
            res1 = res1.replace(/\d\W\d\strieu/gi, "");
            res1 = res1.replace(/\d\d\d\strieu/gi, "");
            res1 = res1.replace(/\d\d\strieu/gi, "");
            res1 = res1.replace(/\d\strieu/gi, "");

            res1 = res1.replace(/\d\d\d\W\dtrieu/gi, "");
            res1 = res1.replace(/\d\d\W\dtrieu/gi, "");
            res1 = res1.replace(/\d\W\dtrieu/gi, "");

            res1 = res1.replace(/\d\d\dtrieu/gi, "");
            res1 = res1.replace(/\d\dtrieu/gi, "");
            res1 = res1.replace(/\dtrieu/gi, "");

            res1 = res1.replace(/\d\dtrieu\d\d/gi, "");
            res1 = res1.replace(/\d\dtrieu\d/gi, "");
            res1 = res1.replace(/\dtrieu\d\d/gi, "");
            res1 = res1.replace(/\dtrieu\d/gi, "");



            document.getElementsByName("subject")[i].value = res1;
        }
        //****tr****//
        if(string1.search(/tr/gi)>-1)
        {
            res1 = string1.replace(/\d\d\d\W\d\str(?!\S)/gi, "");
            res1 = res1.replace(/\d\d\W\d\str(?!\S)/gi, "");
            res1 = res1.replace(/\d\d\W\d\d\str(?!\S)/gi, "");
            res1 = res1.replace(/\d\W\d\d\str(?!\S)/gi, "");
            res1 = res1.replace(/\d\W\d\str(?!\S)/gi, "");
            res1 = res1.replace(/\d\d\d\str(?!\S)/gi, "");
            res1 = res1.replace(/\d\d\str(?!\S)/gi, "");
            res1 = res1.replace(/\d\str(?!\S)/gi, "");

            res1 = res1.replace(/\d\d\d\W\dtr(?!\S)/gi, "");
            res1 = res1.replace(/\d\d\W\dtr(?!\S)/gi, "");
            res1 = res1.replace(/\d\W\dtr(?!\S)/gi, "");

            res1 = res1.replace(/\d\d\dtr(?!\S)/gi, "");
            res1 = res1.replace(/\d\dtr(?!\S)/gi, "");
            res1 = res1.replace(/\dtr(?!\S)/gi, "");

            res1 = res1.replace(/\d\dtr\d\d/gi, "");
            res1 = res1.replace(/\d\dtr\d/gi, "");
            res1 = res1.replace(/\dtr\d\d/gi, "");
            res1 = res1.replace(/\dtr\d/gi, "");



            document.getElementsByName("subject")[i].value = res1;
        }
        //****K****//
        if(string1.search(/\dk/gi)>-1)
        {
            res1 = string1.replace(/\d\d\dk(?!\w)/gi, "");
            res1 = res1.replace(/\d\dk(?!\w)/gi, "");
            res1 = res1.replace(/\dk(?!\w)/gi, "");

            document.getElementsByName("subject")[i].value = res1;
        }
        i++;
        /////////////////////////////////////////////

    }
}

///xóa sđt//
xoasdt();
//xóa giá//
//xoagia();

//keyword cả 2 phần//
xoaca2("tốt nhất ");
xoaca2("tốt nhất");
xoaca2("duy nhất ");
xoaca2("duy nhất");
xoatunhat();


//keyword tiêu đề//
/*xoatieude("đồng giá ");
xoatieude("đồng giá");
xoatieude("siêu phẩm ");
xoatieude("siêu phẩm");
xoatieude("siêu khủng ");
xoatieude("siêu khủng");
xoatieude("cho thuê ");
xoatieude("cho thuê");
xoatieude("cần thuê ");
xoatieude("cần thuê");
xoatieude("thanh lý ");
xoatieude("thanh lý");
xoatieude("thanh lí ");
xoatieude("thanh lí");
xoatieude("thanh lý ");
xoatieude("thanh lý");
xoatieude("thần thánh ");
xoatieude("thần thánh");
xoatieude("ra đi ");
xoatieude("ra đi");
xoatieude("độc lạ ");
xoatieude("độc lạ");
xoatieude("nhượng lại ");
xoatieude("nhượng lại");
xoatieude("lung linh ");
xoatieude("lung linh");
xoatieude("chữa cháy ");
xoatieude("chữa cháy");
xoatieude("chửa cháy ");
xoatieude("chửa cháy");
xoatieude("chống cháy ");
xoatieude("chống cháy");
xoatieude("long lanh ");
xoatieude("long lanh");
xoatieude("dễ thương ");
xoatieude("dễ thương");
xoatieude("dể thương ");
xoatieude("dể thương");
xoatieude("can mua ");
xoatieude("can mua");
xoatieude("can ban ");
xoatieude("can mua");
xoatieude("thanh ly ");
xoatieude("thanh ly");

xoatieude("cần ");
xoatieude("cần");
xoatieude("mua ");
xoatieude("mua");
xoatieude("bán ");
xoatieude("bán");
xoatieude("giá ");
xoatieude("giá");
xoatieude("tỷ ");
xoatieude("tỷ");
xoatieude("tuyển ");
xoatieude("tuyển");
xoatieude("tìm ");
xoatieude("tìm");
xoatieude("thuê ");
xoatieude("thuê");
xoatieude("đẹp ");
xoatieude("đẹp");
xoatieude("tốt ");
xoatieude("tốt");
xoatieude("rẻ ");
xoatieude("rẻ");
xoatieude("cực ");
xoatieude("cực");

xoatieude("khủng ");
xoatieude("khủng");
xoatieude("mềm ");
xoatieude("mềm");
xoatieude("sốc ");
xoatieude("sốc");
xoatieude("độc ");
xoatieude("độc");
xoatieude("sang nhượng ");
xoatieude("sang nhượng");
xoatieude("cần sang lại ");
xoatieude("cần sang lại");
xoatieude("sang lại ");
xoatieude("sang lại");
xoatieude("sang ");
xoatieude("sang");
xoatieude("cần nhượng lại ");
xoatieude("cần nhượng lại");
xoatieude("nhượng lại ");
xoatieude("nhượng lại");
xoatieude("chuyển ");
xoatieude("chuyển ");
xoatieude("xinh ");
xoatieude("xinh");
xoatieude("bền ");
xoatieude("bền");
xoatieude("rất ");
xoatieude("rất");
xoatieude("nhanh ");
xoatieude("nhanh");
xoatieude("siêu ");
xoatieude("siêu");
xoatieude("xịn ");
xoatieude("xịn");
xoatieude("keng ");
xoatieude("keng");
xoatieude("ngon ");
xoatieude("ngon");
xoatieude(" êm ");
xoatieude(" êm");
xoatieude("nhượng ");
xoatieude("nhượng");
xoatieude("xịn ");
xoatieude("xịn");
xoatieude("hiếm ");
xoatieude("hiếm");
xoatieude("sỉ ");
xoatieude("sỉ");
xoatieude("lẻ ");
xoatieude("lẻ");
xoatieude("mạnh ");
xoatieude("mạnh");
xoatieude("tuyệt ");
xoatieude("tuyệt");
xoatieude("hay ");
xoatieude("hay ");
xoatieude("chất ");
xoatieude("chất");
xoatieude("sale ");
xoatieude("sale");
xoatieude("chuẩn ");
xoatieude("chuẩn");
xoatieude("triệu ");
xoatieude("triệu");
xoatieude("vip ");
xoatieude("vip");
xoatieude("kẹt tiền ");
xoatieude("kẹt tiền");
xoatieude("rẽ ");
xoatieude("rẽ");
xoatieude("bèo ");
xoatieude("bèo");
xoatieude("cao cấp ");
xoatieude("cao cấp");
xoatieude("huyền thoại ");
xoatieude("huyền thoại");
xoatieude("sấm uất ");
xoatieude("sấm uất");
xoatieude("gia re ");
xoatieude("gia re");
xoatieude("cho thue ");
xoatieude("cho thue");*/
xoatieude("số một");
xoatieude("so mot");
xoatieude("hot ");
xoatieude("hot");
xoatieude("gấp ");
xoatieude("gấp");