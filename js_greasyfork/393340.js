// ==UserScript==
// @name         CVF-add-More
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  when open http://openaccess.thecvf.com/, add more.
// @author       csxz
// @include      http://openaccess.thecvf.com/menu.py
// @include      http://openaccess.thecvf.com/menu_other.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393340/CVF-add-More.user.js
// @updateURL https://update.greasyfork.org/scripts/393340/CVF-add-More.meta.js
// ==/UserScript==

function cvfAddMore() {
    var mainurl = document.location.toString().split('/')[3];
    
    if (mainurl == "menu.py")
    {
        //find where to put the tag
        var loc = document.getElementsByTagName('dl')[0];
        
        //modify some
        loc.childNodes[1].innerHTML = '<a href="http://iccv2019.thecvf.com/">ICCV2019</a>, Seoul Korea [<a href="ICCV2019.py">Main Conference</a>]  [<a href="/ICCV2019_workshops/menu.py">Workshops</a>]<br><br>';
        loc.childNodes[3].innerHTML = '<a href="http://cvpr2019.thecvf.com/">CVPR2019</a>, Long Beach California [<a href="CVPR2019.py">Main Conference</a>]  [<a href="/CVPR2019_workshops/menu.py">Workshops</a>]<br><br>';
        loc.childNodes[5].innerHTML = '<a href="http://cvpr2018.thecvf.com/">CVPR2018</a>, Salt Lake City Utah [<a href="CVPR2018.py">Main Conference</a>]  [<a href="/CVPR2018_workshops/menu.py">Workshops</a>]<br><br>';
        loc.childNodes[7].innerHTML = '<a href="http://iccv2017.thecvf.com/">ICCV2017</a>, Venice Italy [<a href="ICCV2017.py">Main Conference</a>]  [<a href="/ICCV2017_workshops/menu.py">Workshops</a>]<br><br>';
        loc.childNodes[9].innerHTML = '<a href="http://cvpr2017.thecvf.com/">CVPR2017</a>, Honolulu Hawaii [<a href="CVPR2017.py">Main Conference</a>]  [<a href="/CVPR2017_workshops/menu.py">Workshops</a>]<br><br>';
        
        //add some
        var obj0 = document.createElement("dd");
        var obj1 = document.createElement("dd");
        var obj2 = document.createElement("dd");
        var obj3 = document.createElement("dd");
        var obj4 = document.createElement("dd");
        var obj5 = document.createElement("dd");
        var obj6 = document.createElement("dd");
        var obj7 = document.createElement("dd");
        var obj8 = document.createElement("dd");
        var obj11 = document.createElement("dd");
        var obj12 = document.createElement("dd");
        var obj13 = document.createElement("dd");
        var obj14 = document.createElement("dd");
        var obj15 = document.createElement("dd");
        var obj16 = document.createElement("dd");
        var obj17 = document.createElement("dd");
        var obj18 = document.createElement("dd");
        var obj19 = document.createElement("dd");
        var obj20 = document.createElement("dd");
        
        obj0.innerHTML = '<h3>~2018</h3><br><a href="https://eccv2018.org/">ECCV2018</a>, Munich Germany [<a href="ECCV2018.py">Main Conference</a>]  [<a href="/ECCV2018_workshops/menu.py">Workshops</a>]<br><br>';
        obj1.innerHTML = '<a href="https://aaai.org/Conferences/AAAI-19/">AAAI2019</a>, Honolulu Hawaii [<a href="https://aaai.org/Library/AAAI/aaai19contents.php">Main Conference</a>] >>> [<a href="https://aaai.org/Library/AAAI/aaai-library.php">Conferences</a>]<br><br>';
        obj2.innerHTML = '<h3>2019</h3><br><a href="https://neurips.cc/Conferences/2019">NeurIPS2019</a>, Vancouver Canada [<a href="https://papers.nips.cc/book/advances-in-neural-information-processing-systems-32-2019">Main Conference</a>] >>> [<a href="https://neurips.cc/">Conferences</a>] [<a href="https://papers.nips.cc/">Proceedings</a>]<br><br>';
        obj3.innerHTML = '<a href="https://iclr.cc/Conferences/2019">ICLR2019</a>, New Orleans Louisiana, (May 6-9) [<a href="https://openreview.net/group?id=ICLR.cc/2019/Conference">Main Conference</a>]  [<a href="https://openreview.net/group?id=ICLR.cc/2019/Workshop">Workshops</a>] >>> [<a href="https://openreview.net/group?id=ICLR.cc">Conferences</a>]<br><br>';
        obj4.innerHTML = '<a href="http://2019.ieeeicip.org/">ICIP2019</a>, Taipei Taiwan [<a href="https://ieeexplore.ieee.org/xpl/conhome/8791230/proceeding">Main Conference</a>] >>> [<a href="https://ieeexplore.ieee.org/xpl/conhome/1000349/all-proceedings">Proceedings</a>]<br><br>';
        obj5.innerHTML = '<a href="https://ijcai19.org/">IJCAI2019</a>, Macao China [<a href="https://www.ijcai.org/proceedings/2019/">Main Conference</a>] >>> [<a href="https://www.ijcai.org/past_conferences">Conferences</a>] [<a href="https://www.ijcai.org/past_proceedings">Proceedings</a>]<br><br>';
        obj6.innerHTML = '<a href="https://icml.cc/Conferences/2019">ICML2019</a>, Long Beach [<a href="http://proceedings.mlr.press/v97/">Main Conference</a>] >>> [<a href="https://icml.cc/">Conferences</a>] [<a href="http://proceedings.mlr.press/">Proceedings</a>]<br><br>';
        obj7.innerHTML = '<a href="http://icdar2019.org/">ICDAR2019</a>, Sydney Australia [<a href="https://ieeexplore.ieee.org/xpl/conhome/1000219/all-proceedings">Main Conference</a>] >>> [<a href="https://ieeexplore.ieee.org/xpl/conhome/1000219/all-proceedings">Proceedings</a>]<br><br>';
        obj8.innerHTML = '<a href="https://bmvc2019.org/">BMVC2019</a>, Cardiff Wales, (Sep. 9-12) [<a href="https://bmvc2019.org/programme/detailed-programme/">Main Conference</a>] >>> [<a href="https://britishmachinevisionassociation.github.io/bmvc">Proceedings</a>]<br><br>';
        
        obj11.innerHTML = '<a href="https://aaai.org/Conferences/AAAI-20/">AAAI2020</a>, New York USA, (Feb. 7-12) [<a href="https://aaai.org/Library/AAAI/aaai20contents.php">Main Conference</a>] >>> [<a href="https://aaai.org/Library/AAAI/aaai-library.php">Conferences</a>]<br><br>';
        obj20.innerHTML = '<a href="https://mlsys.org/Conferences/2020">MLSys2020</a>, Austin Texas, (Mar. 2-4) >>> [<a href="https://mlsys.org/">Conferences</a>]<br><br>';
        obj12.innerHTML = '<a href="https://wacv20.wacv.net/">WACV2020</a>, Snowmass village Colorado, (Mar. 2-5) [<a href="https://ieeexplore.ieee.org/xpl/conhome/1000040/all-proceedings">Main Conference</a>] >>> [<a href="https://ieeexplore.ieee.org/xpl/conhome/1000040/all-proceedings">Proceedings</a>]<br><br>';
        obj13.innerHTML = '<a href="https://iclr.cc/Conferences/2020">ICLR2020</a>, Addis Ababa Ethiopia, (Apr. 26-30) [<a href="https://openreview.net/group?id=ICLR.cc/2020/Conference">Main Conference</a>]  [<a href="https://openreview.net/group?id=ICLR.cc/2020/Workshop">Workshops</a>] >>> [<a href="https://openreview.net/group?id=ICLR.cc">Conferences</a>]<br><br>';
        obj19.innerHTML = '<a href="https://www.icra2020.org/">ICRA2020</a>, Paris France, (May 31-June 4) [<a href="https://ieeexplore.ieee.org/xpl/conhome/8780387/proceeding">proceeding</a>] >>> [<a href="https://ieeexplore.ieee.org/xpl/conhome/1000639/all-proceedings">Proceedings</a>]<br><br>';
        obj14.innerHTML = '<a href="http://cvpr2020.thecvf.com/">CVPR2020</a>, Seattle Washington, (June 14-19) [<a href="CVPR2020.py">Main Conference</a>]  [<a href="/CVPR2020_workshops/menu.py">Workshops</a>]<br><br>';
        obj15.innerHTML = '<a href="https://ijcai20.org/">IJCAI2020</a>, Macao China, (July 11-17) [<a href="https://www.ijcai.org/proceedings/2019/">Main Conference</a>] >>> [<a href="https://www.ijcai.org/past_conferences">Conferences</a>] [<a href="https://www.ijcai.org/past_proceedings">Proceedings</a>]<br><br>';
        obj16.innerHTML = '<a href="https://icml.cc/Conferences/2020">ICML2020</a>, Yokohama Japan, (July 12-18) [<a href="http://proceedings.mlr.press/">Main Conference</a>] >>> [<a href="https://icml.cc/">Conferences</a>] [<a href="http://proceedings.mlr.press/">Proceedings</a>]<br><br>';
        obj17.innerHTML = '<a href="https://eccv2020.eu/">ECCV2020</a>, Sec, Glasgow, (Aug. 23-28) [<a href="ECCV2020.py">Main Conference</a>]  [<a href="/ECCV2020_workshops/menu.py">Workshops</a>]<br><br>';
        obj18.innerHTML = '<h3>2020</h3><br><a href="https://2020.ieeeicip.org/">ICIP2020</a>, United Arab Emirates, (Oct. 25-28) [<a href="https://ieeexplore.ieee.org/xpl/conhome/8791230/proceeding">Main Conference</a>] >>> [<a href="https://ieeexplore.ieee.org/xpl/conhome/1000349/all-proceedings">Proceedings</a>]<br><br>';
        
        loc.insertBefore(obj0, loc.childNodes[5]);
        loc.insertBefore(obj1, loc.childNodes[0]);
        loc.insertBefore(obj4, loc.childNodes[0]);
        loc.insertBefore(obj6, loc.childNodes[0]);
        loc.insertBefore(obj5, loc.childNodes[0]);
        loc.insertBefore(obj7, loc.childNodes[0]);
        loc.insertBefore(obj8, loc.childNodes[0]);
        loc.insertBefore(obj3, loc.childNodes[0]);
        loc.insertBefore(obj2, loc.childNodes[0]);
        loc.insertBefore(obj11, loc.childNodes[0]);
        loc.insertBefore(obj20, loc.childNodes[0]);
        loc.insertBefore(obj12, loc.childNodes[0]);
        loc.insertBefore(obj13, loc.childNodes[0]);
        loc.insertBefore(obj19, loc.childNodes[0]);
        loc.insertBefore(obj14, loc.childNodes[0]);
        loc.insertBefore(obj15, loc.childNodes[0]);
        loc.insertBefore(obj16, loc.childNodes[0]);
        loc.insertBefore(obj17, loc.childNodes[0]);
        loc.insertBefore(obj18, loc.childNodes[0]);
    }
    else if (mainurl == "menu_other.html")
    {
        //find where to put the tag
        var loc = document.getElementsByTagName('dl')[0];
        
        //modify some
        loc.childNodes[1].innerHTML = '<h3>~2018</h3><br><br><a href="https://eccv2018.org/">ECCV2018</a>, Munich Germany [<a href="ECCV2018.py">Main Conference</a>]  [<a href="/ECCV2018_workshops/menu.py">Workshops</a>]<br><br>';
        
        //add some
        var obj1 = document.createElement("dd");
        var obj2 = document.createElement("dd");
        var obj3 = document.createElement("dd");
        var obj4 = document.createElement("dd");
        var obj5 = document.createElement("dd");
        var obj6 = document.createElement("dd");
        var obj7 = document.createElement("dd");
        var obj8 = document.createElement("dd");
        var obj11 = document.createElement("dd");
        var obj12 = document.createElement("dd");
        var obj13 = document.createElement("dd");
        var obj14 = document.createElement("dd");
        var obj15 = document.createElement("dd");
        var obj16 = document.createElement("dd");
        var obj17 = document.createElement("dd");
        var obj18 = document.createElement("dd");
        var obj19 = document.createElement("dd");
        var obj20 = document.createElement("dd");
        
        obj1.innerHTML = '<a href="https://aaai.org/Conferences/AAAI-19/">AAAI2019</a>, Honolulu Hawaii [<a href="https://aaai.org/Library/AAAI/aaai19contents.php">Main Conference</a>] >>> [<a href="https://aaai.org/Library/AAAI/aaai-library.php">Conferences</a>]<br><br>';
        obj2.innerHTML = '<h3>2019</h3><br><a href="https://neurips.cc/Conferences/2019">NeurIPS2019</a>, Vancouver Canada [<a href="https://papers.nips.cc/book/advances-in-neural-information-processing-systems-32-2019">Main Conference</a>] >>> [<a href="https://neurips.cc/">Conferences</a>] [<a href="https://papers.nips.cc/">Proceedings</a>]<br><br>';
        obj3.innerHTML = '<a href="https://iclr.cc/Conferences/2019">ICLR2019</a>, New Orleans Louisiana [<a href="https://openreview.net/group?id=ICLR.cc/2019/Conference">Main Conference</a>]  [<a href="https://openreview.net/group?id=ICLR.cc/2019/Workshop">Workshops</a>] >>> [<a href="https://openreview.net/group?id=ICLR.cc">Conferences</a>]<br><br>';
        obj4.innerHTML = '<a href="http://2019.ieeeicip.org/">ICIP2019</a>, Taipei Taiwan [<a href="https://ieeexplore.ieee.org/xpl/conhome/8791230/proceeding">Main Conference</a>] >>> [<a href="https://ieeexplore.ieee.org/xpl/conhome/1000349/all-proceedings">Proceedings</a>]<br><br>';
        obj5.innerHTML = '<a href="https://ijcai19.org/">IJCAI2019</a>, Macao China [<a href="https://www.ijcai.org/proceedings/2019/">Main Conference</a>] >>> [<a href="https://www.ijcai.org/past_conferences">Conferences</a>] [<a href="https://www.ijcai.org/past_proceedings">Proceedings</a>]<br><br>';
        obj6.innerHTML = '<a href="https://icml.cc/Conferences/2019">ICML2019</a>, Long Beach [<a href="http://proceedings.mlr.press/v97/">Main Conference</a>] >>> [<a href="https://icml.cc/">Conferences</a>] [<a href="http://proceedings.mlr.press/">Proceedings</a>]<br><br>';
        obj7.innerHTML = '<a href="http://icdar2019.org/">ICDAR2019</a>, Sydney Australia [<a href="https://ieeexplore.ieee.org/xpl/conhome/1000219/all-proceedings">Main Conference</a>] >>> [<a href="https://ieeexplore.ieee.org/xpl/conhome/1000219/all-proceedings">Proceedings</a>]<br><br>';
        obj8.innerHTML = '<a href="https://bmvc2019.org/">BMVC2019</a>, Cardiff Wales, (Sep. 9-12) [<a href="https://bmvc2019.org/programme/detailed-programme/">Main Conference</a>] >>> [<a href="https://britishmachinevisionassociation.github.io/bmvc">Proceedings</a>]<br><br>';
        
        obj11.innerHTML = '<a href="https://aaai.org/Conferences/AAAI-20/">AAAI2020</a>, New York USA, (Feb. 7-12) [<a href="https://aaai.org/Library/AAAI/aaai20contents.php">Main Conference</a>] >>> [<a href="https://aaai.org/Library/AAAI/aaai-library.php">Conferences</a>]<br><br>';
        obj20.innerHTML = '<a href="https://mlsys.org/Conferences/2020">MLSys2020</a>, Austin Texas, (Mar. 2-4) >>> [<a href="https://mlsys.org/">Conferences</a>]<br><br>';
        obj12.innerHTML = '<a href="https://wacv20.wacv.net/">WACV2020</a>, Snowmass village Colorado, (Mar. 2-5) [<a href="https://ieeexplore.ieee.org/xpl/conhome/1000040/all-proceedings">Main Conference</a>] >>> [<a href="https://ieeexplore.ieee.org/xpl/conhome/1000040/all-proceedings">Proceedings</a>]<br><br>';
        obj13.innerHTML = '<a href="https://iclr.cc/Conferences/2020">ICLR2020</a>, Addis Ababa Ethiopia, (Apr. 26-30) [<a href="https://openreview.net/group?id=ICLR.cc/2020/Conference">Main Conference</a>]  [<a href="https://openreview.net/group?id=ICLR.cc/2020/Workshop">Workshops</a>] >>> [<a href="https://openreview.net/group?id=ICLR.cc">Conferences</a>]<br><br>';
        obj19.innerHTML = '<a href="https://www.icra2020.org/">ICRA2020</a>, Paris France, (May 31-June 4) [<a href="https://ieeexplore.ieee.org/xpl/conhome/8780387/proceeding">proceeding</a>] >>> [<a href="https://ieeexplore.ieee.org/xpl/conhome/1000639/all-proceedings">Proceedings</a>]<br><br>';
        obj14.innerHTML = '<a href="http://cvpr2020.thecvf.com/">CVPR2020</a>, Seattle Washington, (June 14-19) [<a href="CVPR2020.py">Main Conference</a>]  [<a href="/CVPR2020_workshops/menu.py">Workshops</a>]<br><br>';
        obj15.innerHTML = '<a href="https://ijcai20.org/">IJCAI2020</a>, Macao China, (July 11-17) [<a href="https://www.ijcai.org/proceedings/2019/">Main Conference</a>] >>> [<a href="https://www.ijcai.org/past_conferences">Conferences</a>] [<a href="https://www.ijcai.org/past_proceedings">Proceedings</a>]<br><br>';
        obj16.innerHTML = '<a href="https://icml.cc/Conferences/2020">ICML2020</a>, Yokohama Japan, (July 12-18) [<a href="http://proceedings.mlr.press/">Main Conference</a>] >>> [<a href="https://icml.cc/">Conferences</a>] [<a href="http://proceedings.mlr.press/">Proceedings</a>]<br><br>';
        obj17.innerHTML = '<a href="https://eccv2020.eu/">ECCV2020</a>, Sec, Glasgow, (Aug. 23-28) [<a href="ECCV2020.py">Main Conference</a>]  [<a href="/ECCV2020_workshops/menu.py">Workshops</a>]<br><br>';
        obj18.innerHTML = '<h3>2020</h3><br><a href="https://2020.ieeeicip.org/">ICIP2020</a>, United Arab Emirates, (Oct. 25-28) [<a href="https://ieeexplore.ieee.org/xpl/conhome/8791230/proceeding">Main Conference</a>] >>> [<a href="https://ieeexplore.ieee.org/xpl/conhome/1000349/all-proceedings">Proceedings</a>]<br><br>';
        
        loc.insertBefore(obj1, loc.childNodes[0]);
        loc.insertBefore(obj4, loc.childNodes[0]);
        loc.insertBefore(obj6, loc.childNodes[0]);
        loc.insertBefore(obj5, loc.childNodes[0]);
        loc.insertBefore(obj7, loc.childNodes[0]);
        loc.insertBefore(obj8, loc.childNodes[0]);
        loc.insertBefore(obj3, loc.childNodes[0]);
        loc.insertBefore(obj2, loc.childNodes[0]);
        loc.insertBefore(obj11, loc.childNodes[0]);
        loc.insertBefore(obj20, loc.childNodes[0]);
        loc.insertBefore(obj12, loc.childNodes[0]);
        loc.insertBefore(obj13, loc.childNodes[0]);
        loc.insertBefore(obj19, loc.childNodes[0]);
        loc.insertBefore(obj14, loc.childNodes[0]);
        loc.insertBefore(obj15, loc.childNodes[0]);
        loc.insertBefore(obj16, loc.childNodes[0]);
        loc.insertBefore(obj17, loc.childNodes[0]);
        loc.insertBefore(obj18, loc.childNodes[0]);
    }
}

window.onload = cvfAddMore;