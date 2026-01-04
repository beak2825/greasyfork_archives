// ==UserScript==
// @name          CLHS homepage ver-6.9
// @version       ver-6.9
// @author        VFLC
// @namespace     http://diveintogreasemonkey.org/download/
// @description   try to make the shitty website prettier
// @include       https://www.clhs.tyc.edu.tw/home
// @downloadURL https://update.greasyfork.org/scripts/427243/CLHS%20homepage%20ver-69.user.js
// @updateURL https://update.greasyfork.org/scripts/427243/CLHS%20homepage%20ver-69.meta.js
// ==/UserScript==


const CARD_info = {
  score: ['成績查詢', 'https://eschool.clhs.tyc.edu.tw/online/'],
  self_taught: ['自主學習', 'http://auto-learning.clhs.tyc.edu.tw/Login'],
  timer: ['計時器', 'https://timer.onlinealarmkur.com/zh-tw/'],
  rand_picker: ['選號器', 'https://www.toolskk.com/random'],
  oj: ['Online Judge','http://judge-web.clhs.tyc.edu.tw/'],
  itai: ['what\'s this?', 'https://bit.ly/3vkyH78'],
};


const display = _ => {
  if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
    thispanel.style.display = 'none';
  }
  else {
    if(window.innerWidth < 1000 || window.innerHeight < 700){
      thispanel.style.display = 'none';
    }
    else{
      thispanel.style.display = null;
    }
  }
};


/* ======================================================================== funcs ======================================================================== */

const win_resize = () => {
  display();

  const h = window.innerHeight;
  const w = window.innerWidth;

  thispanel.style.height = h + 'px';
  thispanel.style.width = w + 'px';
  window.scrollTo({ top: 0 });

  let innerhtml = "";
  let card_list = [
    CARD_info.score,
    CARD_info.self_taught,
    CARD_info.timer,
    CARD_info.rand_picker
  ];

  [
    CARD_info.score,
    CARD_info.self_taught,
    CARD_info.timer,
    CARD_info.rand_picker
  ].forEach( ([name, url]) => {
    innerhtml += `
    <div class="card">
      <div class="card_image"> <img src="https://media.giphy.com/media/8bC0Tmsu13ea24YvwT/giphy.gif" onclick="document.location.href = '${url}'" /> </div>
      <div class="card_title">
        <p>${name}</p>
      </div>
    </div>
   `});

  if(w>1500){
    [
      CARD_info.oj,
      CARD_info.itai
    ].forEach( ([name, url]) => {
      innerhtml += `
      <div class="card">
        <div class="card_image"> <img src="https://media.giphy.com/media/8bC0Tmsu13ea24YvwT/giphy.gif" onclick="document.location.href = '${url}'" /> </div>
        <div class="card_title">
          <p>${name}</p>
        </div>
      </div>
   `});
  }

  return innerhtml;
};


/* ======================================================================== style ======================================================================== */


const style = document.createElement('style');
style.innerHTML = `
.thispanel {
  background-image: url("https://i.imgur.com/CXveqYr.jpg");
  background-size: cover;
}

.thish1 {
  padding: 0;
  margin: 0;
  color: #fff;
  font-size: 3rem;
  text-align: center;
}

/* ================== cards ================== */
.cards-list {
  z-index: 0;
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}

.card {
  margin: 30px auto;
  width: 500px;
  height: 300px;
  border-radius: 40px;
  box-shadow: 5px 5px 30px 15px rgba(0,0,0,0.25), -5px -5px 30px 15px rgba(0,0,0,0.22);
  cursor: pointer;
  transition: 0.4s;
}

.card .card_image {
  width: inherit;
  height: inherit;
  border-radius: 40px;
}

.card .card_image img {
  width: inherit;
  height: inherit;
  border-radius: 40px;
  object-fit: cover;
}

.card .card_title {
  text-align: center;
  border-radius: 0px 0px 40px 40px;
  font-family: sans-serif;
  font-weight: bold;
  font-size: 35px;
  margin-top: -80px;
  height: 40px;
  color: #fff;
}

.card:hover {
  transform: scale(0.9, 0.9);
  box-shadow: 5px 5px 30px 15px rgba(0,0,0,0.25), -5px -5px 30px 15px rgba(0,0,0,0.22);
}

@media all and (max-width: 1000px) {
  .card-list {
    /* On small screens, we are no longer using row direction but column */
    flex-direction: column;
  }

  .card {
    height: 250px;
    box-shadow: 5px 5px 20px 7px rgba(0,0,0,0.25), -5px -5px 20px 7px rgba(0,0,0,0.22);
  }
}
/* ================== cards ================== */

`;
document.head.append(style);



/* ======================================================================== body ======================================================================== */


const thispanel = document.createElement("div");
thispanel.className = "thispanel cards-list";
thispanel.innerHTML = win_resize();

document.body.prepend(thispanel);


/* ======================================================================== handlers ======================================================================== */


window.addEventListener('resize', _ => {
  thispanel.innerHTML = win_resize();
});









