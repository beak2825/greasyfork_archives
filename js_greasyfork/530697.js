// ==UserScript==
// @name         B站视频增添倍速选项
// @namespace    https://yww52.com
// @version      1.0
// @description  B站的倍速选项太少了，所以提供了一个按钮，以0.1为步长，增加视频倍速选项
// @author       yww
// @include      *://*.bilibili.com/video/*
// @include      *://*.bilibili.tv/video/*
// @icon         data:image/x-icon;base64,AAABAAIAICAAAAEAIACoEAAAJgAAADAwAAABACAAqCUAAM4QAAAoAAAAIAAAAEAAAAABACAAAAAAAAAQAADDDgAAww4AAAAAAAAAAAAAy1+9/9FFuP/TZcT/1HTR/+Oq3v/euOb/qmWN/6tfhP+ZWnr/qlaG/65bh/+xZIn/sGKJ/7Nki/+oWoP/oVh+/7Nki/+wYoj/sGKK/7Jhif+0h57/k1h5/69jif+dVHn/5MrV/9vd3v/aqN3/76bh/+GIsf/wrvL/5JfQ/9h+nv+/RoX/yTGR/9pmxf/aeMj/4JXO/+S+7P+qaIz/llV3/6tjhv+oUoL/rluI/7Flif+vYon/sWWK/6tbhP+pXIT/smWK/7Bjif+vX4b/t3GV/8itu/+SS3L/smWL/6JVfP/Wwsv/0tPT/+Go5P/yltz/6JLD//Sy9v/2r/b/8qvs/7xyof/HRor/2Xy6/9561//hi9P/253k/5BbeP+nXIL/s2WL/5hOeP+vXoj/sWSJ/7Bjif+wY4n/smKJ/7Fjiv+wY4n/sGOJ/61dhP+7fZv/uJWm/6FLe/+xZYv/rVuE/8mzvv/Lx8z/7sXx/+2V0v/uueH/87H1//Kr7P/wpuH/kVN6/7JGev/hcsv/4Hja/+en3P/gsen/nVyD/7Vliv+sYYf/nVp8/7Jkiv+wY4n/sGOJ/7Bjif+wYon/r2OI/69jif+wY4n/sWOJ/7Fli/+xaY7/pFuB/65jif+uYIb/6Nvh/9LF0v/urfT/7p3Q/+6t2P/zsvT/863q//Kp5/+XV3j/jjhN/8VClv/hbM7/3ozN/+y38v+0gKf/q1yC/69kif+qYYX/sGOJ/69jiP+vY4n/sWSK/7Jki/+0ZYz/s2SK/7Bih/+vYYb/rmCG/7Bgh/+oX4P/qFd//7Foj//r6+v/ybfM//Oz9//pnMX/78nl//Ky8v/1ru7/9a/z/5pjdf+GP0P/mj5g/9BPqP/omuL/45rZ/8N6tf+gWnz/t2SN/7JljP+vY4n/sWSK/7Jjif+sX4P/pVx//5xZfP+gXIL/rmWO/7Zplv+2aZX/s2iT/6xni//EnbH/4MfZ/+zw7P/Uocz/66bT/+m50f/yu/H/863w//Su7v/zr+7/k1dp/4Q8PP+HQkj/oTph/9BZsv/qq+3/6qvo/82LxP+bXX3/qFuA/7Jiif+vZIr/nl+F/6dqmP+2dq3/u3q3/8J5wf+ydbD/t3m0/8OBv//ThdP/wn7a/8fFzv/Z6N7/0c3U/9+01v/yyO3/8sH3//LS9f/ztPL/87Lq//Ow7f+MSlD/fzk8/4U/Qv+IQkf/nzpj/8xitf/5uv//r3mw/5t+mf/Fo77/pF+G/5NVdv/Jhcj/3Yzb/9uH2P/WitL/2YvU/9uN1//Ohsv/2IjS/9eS3f/aru3/mJGX/5p2hv/apMz/7rTh/+SmzP/os9j/6qbU/+iXwv/voM3/8arp/4lFSf+GP0L/h0BE/4g/Qf+HQkf/lDdb/9tzwv+RbJD/azRn/7ZzuP/myef/uoGz/5RmkP+gXZ//uWm3/690rf+xda7/uH23/8aox//Nrcz/y8jM/7GOs/+HYY//s3WM/9hxqv/iwbz/57bD/+eivf/su8f/65m//+6Fqv/wpNf/hkNH/4U+Qf+HP0L/hz9D/4Y/Q/+DP0X/oEBs/2gxUP9yIHD/ew54/6lwqf/NpM//rXSr/8J+vf/Vi9H/2ovV/9SI0P/FgMH/oI6h/7ygvv+tZq7/izCi/5FMqP+7kZ3/24+6/9iRrv/qxdH/6L/H/+eewP/qosf/7Iur/+6o1f+JQET/iUBE/4lBRP+MQUX/i0FF/4hCRP+QRlb/UCU3/3kXdv+BEoD/iCiG/7d5sv/djdn/24zX/9CGzP/Lgsn/14rS/9mK1f/Yi9T/vX6//6AqpP+iNb3/nVK7/76Jof/TaY3/4re9/9+Ku//mucr/673P/+iXvP/qmK7/7a3Y/2w1Nv9wOzn/dTc5/3U4Of94Njn/ezM1/348Qv9KHy3/cBhs/4g7if+5eLb/4pHf/9KIz//XitL/xX/C/8WIw//YidP/0ojP/9OFz//alur/toHF/5Msr/+aTLb/xI+q/9Jbhf/Wdpn/5qXO/+SUvv/prNH/6pi5/+6qtv/xvOj/PCoW/zhEHv84PyT/PDgd/z46HP9COBz/Qjsp/0kyOP+wcKz/r3qu/757uv/Mhsj/zoTI/9mJ1P/Nhsr/0JHN/9eJ0//YidP/1IjS/9WF8P/OnOP/llKq/51Zsv++jZ7/1FuB/9Zpm//qntr/6KDY/+uw2P/rn7z/7KS0/+/G5/8/Kxn/PUcl/00vMv9DOir/OUcd/z1GIv84PCP/gF18/7x6uf+CXH//yZLJ/7N4t/+jebH/uH+1/9eJ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z//3vfr/6qzd/9mGn//rptr/7azx/+KWzP/TeJ3/132T/8Bgpf/KPqH/00++/89Lsf/liO3/0Gq7/9ybzv/wz/X/3rbm/6FjiP+2ZYz/mVl7/5ZXd/+1Z43/qkyE/7Baif+wZYn/sGOJ/7Bjif+wY4n/r2OJ/7Jiiv+WSXX/rGOH/7Fjiv+wY4n/sWKJ/7Fiif+xZIv/q1mC/9a8yv+pe5T/jUVt/7Rnjv+tZIn/mVJ2/8+pu///////vbS8/9mY2P/5tfz/5orO/+R0pP/wpub/8q70//Kv9f/to+D/34mz/7xPg/+8HGf/0UKm/9JUof/mjvH/1Gmv/9qFv//rs/P/4b7m/6pqj/+kXH//i1Ny/7Nli/+uZIf/m0Z6/7Baiv+wZYn/sGOJ/69jif+wY4n/sGOJ/7Jiif+lVIH/sGSJ/7Fjiv+wY4n/r2KI/7Bjif+wX4f/t3GU/9jS1f+eW37/kEpx/7Jliv+zZIv/oVZ9/7ecqv//////s66y/+Gt4f/6sfr/7Y7Q/+aOuf/vsev/9q70//St8//3sfT/+Lb//75+ov/PXKL/wSt3/8tZjv/omPT/1mW8/9qAwv/ol/L/3abf/4teeP+PUXH/q2GI/7Jji/+rYYX/j0Fx/7Ffi/+wZIn/sGOJ/7Bjif+wY4n/sGOJ/7Fjif+zYor/sGOJ/7Bjif+wY4n/sGKI/69kif+tW4P/wYWj/8bBw/+gUHr/nU99/7Jlif+wY4r/rluE/7iTpv/P1NH/tq61//Hd8f/0sfP/6YbH/+/H4//wvfT/9Kvy//Su8v/yq+n/8Kjm/5phhP+8crL/xlaM/9qMvf/sk/L/2WjQ/+Cc0//ttvX/1JDe/4RUcf+zZIv/sGOK/7Jkiv+jXYP/lk93/7Vkjf+vY4j/sGOJ/7Bjif+wY4n/sWKJ/7Biif+wYoj/sGOJ/7Bjif+wY4n/sGOJ/7Bjif+vYIb/tnGT/7iNov+qW4T/q1iF/7Jji/+xZYr/qliB/9m6zP/t9e//yarJ//O58v/xs/P/54a2/+yt1f/1sff/8q7t//Kt6v/vpeD/7JrO/49Ncv+LOV//uzhy/9VLrP/piPP/3G7H/+Ka1f/vy/L/5a3r/5ZahP+vYYT/r2OJ/7Rli/+dW33/n1x9/7Rli/+vY4n/sGOJ/7Bjif+wY4n/sGOJ/7Fjif+wYon/sGOJ/7Bjif+wY4n/sGOJ/7Bjif+yY4r/sGGK/65iiP+yZIv/l1h5/61ih/+zZIv/q16D/+LO2f/y+PT/taG1//Ww9//ws/X/7ZPD/+6tzv/yuPf/8q3s//Wv7v/1sO//9bH2/6hwoP+HPkr/m0Nm/8Q8h//dZM//4GvB/9t9xP/jpeP/8874/7KKq/+mW3//sWSL/7Fjiv+mX4P/qmGF/7Fjiv+wY4n/sGOJ/7BiiP+wY4n/sGOJ/7Bjif+vY4j/r2KI/69jif+wY4n/sGOK/7Fjiv+yY4r/sGOK/69iiv+zY4r/nFt9/6lhhP+xYIj/r2qN//Pt8f/Z3dv/t6m5//y+/P/wq/D/65a8/+/X4f/ww/P/86rw//Su8P/0ru3/867x/59ijP+FPD//i0FW/6ZBZ//IP5z/5HXc/+GVzf/iluP/5ZHh/9Ga1P+XV33/tmWM/69iif+wZIr/sGOJ/69iif+wY4n/sGOJ/69jiP+vYon/sGOK/7Fki/+0ZI3/t2aO/7Rli/+zY4n/rmCE/61ghP+tYIX/rWCF/69ghf+wYoj/smKJ/7Jojf+sXYb/uYGn//v+/f/W1Nb/1p3Y//m2///hpcn/5JS0//HG8f/xt/H/8q3u//Su7v/0rvD/9K7z/6J6iv+PSk3/hz1A/41BW/+sP2z/00mp/+uW5f/ipNv/3ZbM/9l/x/+bWYH/pFx9/7Rjiv+xZIr/r2OJ/7Bjif+wY4n/sGOJ/7Nki/+3ZYz/sGKG/6hdgP+aV3j/j1Jz/5dYff+gX4P/uGub/79vof+7bZ3/u2yc/7hsmv+qY43/o2OE/8ivvf/j2d//7OPt//3//P/JvMf/4JnU/+WfxP/qvs7/8cfn//G68f/0rfL/8q7w//Wu8//yr+v/87Dw/6Jsjv+APTz/iUBG/4dARf+VQVv/sDtv/8tKqv/nnej/57Pi/+el5//lsN7/wHmw/6lfhf+sXYP/tmaN/7Bkiv+wY4n/smSK/6dfg/+OU3P/ll+H/6dpm/+haZz/s3aw/712vf+xbrD/pnGk/6tyqf+2erP/v369/9eM0v/Phtf/wYra/8zHz//M0s//5eXk/+jo6P+4p7P/57/T/+664f/ur+7/8snz//Ln8P/xv/H/8qzr//Kw6P/zr+b/8q/t/4xPXv+GPUD/gDo7/4c/QP+GQEn/mEJc/7A7cv/RWMD/7KXz/+us7//yp/f/x4fI/3hdbv+gdZD/mlR4/7Bghv+3Z47/mVp9/6Brmv+/fr3/1YnQ/9mP1v/ejtn/3IzX/9iL0//Yh9T/x4PD/8aBwv/Ohsv/zYjK/9GF0P/Ug+b/0IXy/5aKnP/Z3Nr/mJ+d/8jGyv/qt+7/9Lv0//Hc9f/yz/X/8Kjx//C/8//xvvP/8a7o//Ky5f/xser/9K7z/5JUWP+BO0D/fTo8/4Y/Q/+IP0L/hkBE/5JCV/+tO3P/yFyu/+eu8f/7vP//eU5z/5Jpjf/12fz/vKG5/5ljiP+fWXr/k1x9/9qO2v/cjdf/1ofT/9qC1v/WiNL/1YrT/9iL0//ajdb/24vW/8eIxv/Pgcv/2YXT/9uR3f/Xpuf/5Mzt/56ZnP9yXmX/pWSD/9+Yyf/ostr/457I/9yMtf/lpsv/4LDF/+yi0v/ggqv/5pO3/+6VwP/tnM3/867w/41JT/+GPkD/iEFE/4dAQ/+HP0P/ij9C/4dARP+RQlv/pTpr/8tfsP/4uP7/ZEhh/3ZScv+DO4H/2aza//fR9/+4gLb/iFd4/5tnlP+xdLH/qVmp/7pet/+oZ6j/mmqY/6lyp/+zdrD/0ovR/86s0P/XoNT/2LrX/8bCx//DwsP/upS4/4dZj/+Wior/yWeS/89anP/cpLD/8O/W/+Spu//hg7H/7cLM/+7c1P/sncH/6pm8//CErf/tjbb/8bDq/4VDSP+GP0H/hj9D/4c/Q/+HP0L/iD9D/4ZAQ/+GQEz/jEJZ/6I4af/RZr3/YT5U/0kqRf+qFqn/ZiBn/825zf//3v//7K3x/4poi/9xTG//pWij/8F/vf/Nhsv/z4XK/86Fy/+scqj/oW+g/6ujrv+vs7D/vKe//8aqxf+7or//gziS/4wwpv+ak5f/uHqQ/96Wyv/Rc6D/2qKy/+7n1v/x2eT/4H6r/+mZtP/vw+H/65fA/++Jrf/qkbL/8rDm/4xJTf+FPkH/hz9D/4g/Q/+IP0L/iD9D/4ZAQv+JQEL/h0BH/4pCWP+lPXT/Qhsu/2spav+lIaL/XhFc/5w0nP+liaX/sImw/79+vP/Wi9L/3pDY/9mL1f/aitX/2IrT/9eK0v/fjdn/1orS/6Z6pv+XkJf/36rh/6tYq/+AJor/mTq4/4wvo/+ijKb/y4eb/9qIu//cqL3/2Yer/+GUuf/t4t3/5L+7/+ia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Qv9yNjj/bTo5/3FAQP9wPT3/cT8+/3FCQf9zQUD/dkND/4BCRP+HQkX/ikFF/4pDR/+PQkf/jkJK/41EXP+LQmj/ikhm/4tUYv+KYmL/iGRi/4lkYv+KZGL/lWNj/5tjY/+jY2b/p2Nu/6tjev+vY4f/sGKJ/69mif+wdYn/sICJ/7GIhv+yiYf/somI/7OJh/+wiIj/sIiQ/6+In/+wh6z/uIWx/8OKr//JkK7/zqSx/86Urf/Qj6//1KC8/4o/Q/+COTz/gzs//4M9Qf93NDz/dzI3/39AQv95PT7/dTc4/4I+Q/+FP0T/iD9A/4E7Pf+FPT//hT9F/4Y9WP+GPWP/hUBj/4hSY/+JYWT/h2Zi/4hmY/+KZGL/jWRi/5FkYv+gYmP/qWNq/6xlc/+wY4f/sWKL/7Biif+vc4j/r4KJ/7CFiP+viIb/sYSF/7KHh/+0iov/tIuK/7OMkv+3jqL/vpSw/8icrf/MnKn/1LG1/9Suyf/VrMv/1rTS/4pAQ/+KQUX/jEFG/4o/RP+KQUr/iz9E/4lARP+GPkP/gzxC/4dATf+HQVr/iUBV/3o0RP+IQk//kElW/5JOXf+VUmL/kk1k/4pGXf+KT1b/ilVX/4pYWP+LXF//jV9k/5FhZv+aZGb/m1ph/59ea/+lZHj/rWV8/7Bvhf+0f4j/tIaI/7iJjP++iJX/vHuW/8mEof/NkKz/zZSr/86dq//Rpqv/1bKv/9Ozrv/StK3/0bGx/9SyzP/WstP/1K/S/3g0QP+CPUP/gDo8/4Q/Qv+GQEP/hkBE/4dBQ/+IQkP/iUJL/4lBUP+MQVr/i0Jl/4o/aP+KQmb/kk9j/5hYY/+eYWP/n2Rk/6ZgY/+qXmD/q19i/61gZP+uYnT/rmN9/69ihf+sY4b/rmGF/65ihP+teIP/sIaF/7KKh/+yi4j/tImI/7iJif+9iY7/xIui/8eKqP/LiKv/0oqx/9OXsP/Rp67/0bGu/9Cvr//OqrL/zqe9/8els//GoLj/z6m8/2AkP/9jKED/YCM6/2coP/9oKkH/ays//20sNf99NkD/fTxE/35BS/9+P1D/gTpT/4pHYf+NTGL/jkhk/5FPY/+dXGT/n2Bk/6djZf+tZGf/rWVl/7FlZP+yZWz/r2R4/7FjhP+vY4X/sWOG/7Fihv+wdob/sIKI/7ODif+xhIj/sYSI/7WHif+6iI//voCT/72Clv/ChZ//xY+n/76Nl/+1ipf/t46f/7SNqP+zh6r/sImq/7OXqP+8n6j/yKao/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530697/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%A2%9E%E6%B7%BB%E5%80%8D%E9%80%9F%E9%80%89%E9%A1%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/530697/B%E7%AB%99%E8%A7%86%E9%A2%91%E5%A2%9E%E6%B7%BB%E5%80%8D%E9%80%9F%E9%80%89%E9%A1%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 当前选中的速度框
    let selectedButton = null;
    // 当前默认初始值
    let indexRate = '1.0';

    // 初始值图片
    let mainImg = 'data:image/x-icon;base64,AAABAAIAICAAAAEAIACoEAAAJgAAADAwAAABACAAqCUAAM4QAAAoAAAAIAAAAEAAAAABACAAAAAAAAAQAADDDgAAww4AAAAAAAAAAAAAy1+9/9FFuP/TZcT/1HTR/+Oq3v/euOb/qmWN/6tfhP+ZWnr/qlaG/65bh/+xZIn/sGKJ/7Nki/+oWoP/oVh+/7Nki/+wYoj/sGKK/7Jhif+0h57/k1h5/69jif+dVHn/5MrV/9vd3v/aqN3/76bh/+GIsf/wrvL/5JfQ/9h+nv+/RoX/yTGR/9pmxf/aeMj/4JXO/+S+7P+qaIz/llV3/6tjhv+oUoL/rluI/7Flif+vYon/sWWK/6tbhP+pXIT/smWK/7Bjif+vX4b/t3GV/8itu/+SS3L/smWL/6JVfP/Wwsv/0tPT/+Go5P/yltz/6JLD//Sy9v/2r/b/8qvs/7xyof/HRor/2Xy6/9561//hi9P/253k/5BbeP+nXIL/s2WL/5hOeP+vXoj/sWSJ/7Bjif+wY4n/smKJ/7Fjiv+wY4n/sGOJ/61dhP+7fZv/uJWm/6FLe/+xZYv/rVuE/8mzvv/Lx8z/7sXx/+2V0v/uueH/87H1//Kr7P/wpuH/kVN6/7JGev/hcsv/4Hja/+en3P/gsen/nVyD/7Vliv+sYYf/nVp8/7Jkiv+wY4n/sGOJ/7Bjif+wYon/r2OI/69jif+wY4n/sWOJ/7Fli/+xaY7/pFuB/65jif+uYIb/6Nvh/9LF0v/urfT/7p3Q/+6t2P/zsvT/863q//Kp5/+XV3j/jjhN/8VClv/hbM7/3ozN/+y38v+0gKf/q1yC/69kif+qYYX/sGOJ/69jiP+vY4n/sWSK/7Jki/+0ZYz/s2SK/7Bih/+vYYb/rmCG/7Bgh/+oX4P/qFd//7Foj//r6+v/ybfM//Oz9//pnMX/78nl//Ky8v/1ru7/9a/z/5pjdf+GP0P/mj5g/9BPqP/omuL/45rZ/8N6tf+gWnz/t2SN/7JljP+vY4n/sWSK/7Jjif+sX4P/pVx//5xZfP+gXIL/rmWO/7Zplv+2aZX/s2iT/6xni//EnbH/4MfZ/+zw7P/Uocz/66bT/+m50f/yu/H/863w//Su7v/zr+7/k1dp/4Q8PP+HQkj/oTph/9BZsv/qq+3/6qvo/82LxP+bXX3/qFuA/7Jiif+vZIr/nl+F/6dqmP+2dq3/u3q3/8J5wf+ydbD/t3m0/8OBv//ThdP/wn7a/8fFzv/Z6N7/0c3U/9+01v/yyO3/8sH3//LS9f/ztPL/87Lq//Ow7f+MSlD/fzk8/4U/Qv+IQkf/nzpj/8xitf/5uv//r3mw/5t+mf/Fo77/pF+G/5NVdv/Jhcj/3Yzb/9uH2P/WitL/2YvU/9uN1//Ohsv/2IjS/9eS3f/aru3/mJGX/5p2hv/apMz/7rTh/+SmzP/os9j/6qbU/+iXwv/voM3/8arp/4lFSf+GP0L/h0BE/4g/Qf+HQkf/lDdb/9tzwv+RbJD/azRn/7ZzuP/myef/uoGz/5RmkP+gXZ//uWm3/690rf+xda7/uH23/8aox//Nrcz/y8jM/7GOs/+HYY//s3WM/9hxqv/iwbz/57bD/+eivf/su8f/65m//+6Fqv/wpNf/hkNH/4U+Qf+HP0L/hz9D/4Y/Q/+DP0X/oEBs/2gxUP9yIHD/ew54/6lwqf/NpM//rXSr/8J+vf/Vi9H/2ovV/9SI0P/FgMH/oI6h/7ygvv+tZq7/izCi/5FMqP+7kZ3/24+6/9iRrv/qxdH/6L/H/+eewP/qosf/7Iur/+6o1f+JQET/iUBE/4lBRP+MQUX/i0FF/4hCRP+QRlb/UCU3/3kXdv+BEoD/iCiG/7d5sv/djdn/24zX/9CGzP/Lgsn/14rS/9mK1f/Yi9T/vX6//6AqpP+iNb3/nVK7/76Jof/TaY3/4re9/9+Ku//mucr/673P/+iXvP/qmK7/7a3Y/2w1Nv9wOzn/dTc5/3U4Of94Njn/ezM1/348Qv9KHy3/cBhs/4g7if+5eLb/4pHf/9KIz//XitL/xX/C/8WIw//YidP/0ojP/9OFz//alur/toHF/5Msr/+aTLb/xI+q/9Jbhf/Wdpn/5qXO/+SUvv/prNH/6pi5/+6qtv/xvOj/PCoW/zhEHv84PyT/PDgd/z46HP9COBz/Qjsp/0kyOP+wcKz/r3qu/757uv/Mhsj/zoTI/9mJ1P/Nhsr/0JHN/9eJ0//YidP/1IjS/9WF8P/OnOP/llKq/51Zsv++jZ7/1FuB/9Zpm//qntr/6KDY/+uw2P/rn7z/7KS0/+/G5/8/Kxn/PUcl/00vMv9DOir/OUcd/z1GIv84PCP/gF18/7x6uf+CXH//yZLJ/7N4t/+jebH/uH+1/9eJ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z//3vfr/6qzd/9mGn//rptr/7azx/+KWzP/TeJ3/132T/8Bgpf/KPqH/00++/89Lsf/liO3/0Gq7/9ybzv/wz/X/3rbm/6FjiP+2ZYz/mVl7/5ZXd/+1Z43/qkyE/7Baif+wZYn/sGOJ/7Bjif+wY4n/r2OJ/7Jiiv+WSXX/rGOH/7Fjiv+wY4n/sWKJ/7Fiif+xZIv/q1mC/9a8yv+pe5T/jUVt/7Rnjv+tZIn/mVJ2/8+pu///////vbS8/9mY2P/5tfz/5orO/+R0pP/wpub/8q70//Kv9f/to+D/34mz/7xPg/+8HGf/0UKm/9JUof/mjvH/1Gmv/9qFv//rs/P/4b7m/6pqj/+kXH//i1Ny/7Nli/+uZIf/m0Z6/7Baiv+wZYn/sGOJ/69jif+wY4n/sGOJ/7Jiif+lVIH/sGSJ/7Fjiv+wY4n/r2KI/7Bjif+wX4f/t3GU/9jS1f+eW37/kEpx/7Jliv+zZIv/oVZ9/7ecqv//////s66y/+Gt4f/6sfr/7Y7Q/+aOuf/vsev/9q70//St8//3sfT/+Lb//75+ov/PXKL/wSt3/8tZjv/omPT/1mW8/9qAwv/ol/L/3abf/4teeP+PUXH/q2GI/7Jji/+rYYX/j0Fx/7Ffi/+wZIn/sGOJ/7Bjif+wY4n/sGOJ/7Fjif+zYor/sGOJ/7Bjif+wY4n/sGKI/69kif+tW4P/wYWj/8bBw/+gUHr/nU99/7Jlif+wY4r/rluE/7iTpv/P1NH/tq61//Hd8f/0sfP/6YbH/+/H4//wvfT/9Kvy//Su8v/yq+n/8Kjm/5phhP+8crL/xlaM/9qMvf/sk/L/2WjQ/+Cc0//ttvX/1JDe/4RUcf+zZIv/sGOK/7Jkiv+jXYP/lk93/7Vkjf+vY4j/sGOJ/7Bjif+wY4n/sWKJ/7Biif+wYoj/sGOJ/7Bjif+wY4n/sGOJ/7Bjif+vYIb/tnGT/7iNov+qW4T/q1iF/7Jji/+xZYr/qliB/9m6zP/t9e//yarJ//O58v/xs/P/54a2/+yt1f/1sff/8q7t//Kt6v/vpeD/7JrO/49Ncv+LOV//uzhy/9VLrP/piPP/3G7H/+Ka1f/vy/L/5a3r/5ZahP+vYYT/r2OJ/7Rli/+dW33/n1x9/7Rli/+vY4n/sGOJ/7Bjif+wY4n/sGOJ/7Fjif+wYon/sGOJ/7Bjif+wY4n/sGOJ/7Bjif+yY4r/sGGK/65iiP+yZIv/l1h5/61ih/+zZIv/q16D/+LO2f/y+PT/taG1//Ww9//ws/X/7ZPD/+6tzv/yuPf/8q3s//Wv7v/1sO//9bH2/6hwoP+HPkr/m0Nm/8Q8h//dZM//4GvB/9t9xP/jpeP/8874/7KKq/+mW3//sWSL/7Fjiv+mX4P/qmGF/7Fjiv+wY4n/sGOJ/7BiiP+wY4n/sGOJ/7Bjif+vY4j/r2KI/69jif+wY4n/sGOK/7Fjiv+yY4r/sGOK/69iiv+zY4r/nFt9/6lhhP+xYIj/r2qN//Pt8f/Z3dv/t6m5//y+/P/wq/D/65a8/+/X4f/ww/P/86rw//Su8P/0ru3/867x/59ijP+FPD//i0FW/6ZBZ//IP5z/5HXc/+GVzf/iluP/5ZHh/9Ga1P+XV33/tmWM/69iif+wZIr/sGOJ/69iif+wY4n/sGOJ/69jiP+vYon/sGOK/7Fki/+0ZI3/t2aO/7Rli/+zY4n/rmCE/61ghP+tYIX/rWCF/69ghf+wYoj/smKJ/7Jojf+sXYb/uYGn//v+/f/W1Nb/1p3Y//m2///hpcn/5JS0//HG8f/xt/H/8q3u//Su7v/0rvD/9K7z/6J6iv+PSk3/hz1A/41BW/+sP2z/00mp/+uW5f/ipNv/3ZbM/9l/x/+bWYH/pFx9/7Rjiv+xZIr/r2OJ/7Bjif+wY4n/sGOJ/7Nki/+3ZYz/sGKG/6hdgP+aV3j/j1Jz/5dYff+gX4P/uGub/79vof+7bZ3/u2yc/7hsmv+qY43/o2OE/8ivvf/j2d//7OPt//3//P/JvMf/4JnU/+WfxP/qvs7/8cfn//G68f/0rfL/8q7w//Wu8//yr+v/87Dw/6Jsjv+APTz/iUBG/4dARf+VQVv/sDtv/8tKqv/nnej/57Pi/+el5//lsN7/wHmw/6lfhf+sXYP/tmaN/7Bkiv+wY4n/smSK/6dfg/+OU3P/ll+H/6dpm/+haZz/s3aw/712vf+xbrD/pnGk/6tyqf+2erP/v369/9eM0v/Phtf/wYra/8zHz//M0s//5eXk/+jo6P+4p7P/57/T/+664f/ur+7/8snz//Ln8P/xv/H/8qzr//Kw6P/zr+b/8q/t/4xPXv+GPUD/gDo7/4c/QP+GQEn/mEJc/7A7cv/RWMD/7KXz/+us7//yp/f/x4fI/3hdbv+gdZD/mlR4/7Bghv+3Z47/mVp9/6Brmv+/fr3/1YnQ/9mP1v/ejtn/3IzX/9iL0//Yh9T/x4PD/8aBwv/Ohsv/zYjK/9GF0P/Ug+b/0IXy/5aKnP/Z3Nr/mJ+d/8jGyv/qt+7/9Lv0//Hc9f/yz/X/8Kjx//C/8//xvvP/8a7o//Ky5f/xser/9K7z/5JUWP+BO0D/fTo8/4Y/Q/+IP0L/hkBE/5JCV/+tO3P/yFyu/+eu8f/7vP//eU5z/5Jpjf/12fz/vKG5/5ljiP+fWXr/k1x9/9qO2v/cjdf/1ofT/9qC1v/WiNL/1YrT/9iL0//ajdb/24vW/8eIxv/Pgcv/2YXT/9uR3f/Xpuf/5Mzt/56ZnP9yXmX/pWSD/9+Yyf/ostr/457I/9yMtf/lpsv/4LDF/+yi0v/ggqv/5pO3/+6VwP/tnM3/867w/41JT/+GPkD/iEFE/4dAQ/+HP0P/ij9C/4dARP+RQlv/pTpr/8tfsP/4uP7/ZEhh/3ZScv+DO4H/2aza//fR9/+4gLb/iFd4/5tnlP+xdLH/qVmp/7pet/+oZ6j/mmqY/6lyp/+zdrD/0ovR/86s0P/XoNT/2LrX/8bCx//DwsP/upS4/4dZj/+Wior/yWeS/89anP/cpLD/8O/W/+Spu//hg7H/7cLM/+7c1P/sncH/6pm8//CErf/tjbb/8bDq/4VDSP+GP0H/hj9D/4c/Q/+HP0L/iD9D/4ZAQ/+GQEz/jEJZ/6I4af/RZr3/YT5U/0kqRf+qFqn/ZiBn/825zf//3v//7K3x/4poi/9xTG//pWij/8F/vf/Nhsv/z4XK/86Fy/+scqj/oW+g/6ujrv+vs7D/vKe//8aqxf+7or//gziS/4wwpv+ak5f/uHqQ/96Wyv/Rc6D/2qKy/+7n1v/x2eT/4H6r/+mZtP/vw+H/65fA/++Jrf/qkbL/8rDm/4xJTf+FPkH/hz9D/4g/Q/+IP0L/iD9D/4ZAQv+JQEL/h0BH/4pCWP+lPXT/Qhsu/2spav+lIaL/XhFc/5w0nP+liaX/sImw/79+vP/Wi9L/3pDY/9mL1f/aitX/2IrT/9eK0v/fjdn/1orS/6Z6pv+XkJf/36rh/6tYq/+AJor/mTq4/4wvo/+ijKb/y4eb/9qIu//cqL3/2Yer/+GUuf/t4t3/5L+7/+ia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Qv9yNjj/bTo5/3FAQP9wPT3/cT8+/3FCQf9zQUD/dkND/4BCRP+HQkX/ikFF/4pDR/+PQkf/jkJK/41EXP+LQmj/ikhm/4tUYv+KYmL/iGRi/4lkYv+KZGL/lWNj/5tjY/+jY2b/p2Nu/6tjev+vY4f/sGKJ/69mif+wdYn/sICJ/7GIhv+yiYf/somI/7OJh/+wiIj/sIiQ/6+In/+wh6z/uIWx/8OKr//JkK7/zqSx/86Urf/Qj6//1KC8/4o/Q/+COTz/gzs//4M9Qf93NDz/dzI3/39AQv95PT7/dTc4/4I+Q/+FP0T/iD9A/4E7Pf+FPT//hT9F/4Y9WP+GPWP/hUBj/4hSY/+JYWT/h2Zi/4hmY/+KZGL/jWRi/5FkYv+gYmP/qWNq/6xlc/+wY4f/sWKL/7Biif+vc4j/r4KJ/7CFiP+viIb/sYSF/7KHh/+0iov/tIuK/7OMkv+3jqL/vpSw/8icrf/MnKn/1LG1/9Suyf/VrMv/1rTS/4pAQ/+KQUX/jEFG/4o/RP+KQUr/iz9E/4lARP+GPkP/gzxC/4dATf+HQVr/iUBV/3o0RP+IQk//kElW/5JOXf+VUmL/kk1k/4pGXf+KT1b/ilVX/4pYWP+LXF//jV9k/5FhZv+aZGb/m1ph/59ea/+lZHj/rWV8/7Bvhf+0f4j/tIaI/7iJjP++iJX/vHuW/8mEof/NkKz/zZSr/86dq//Rpqv/1bKv/9Ozrv/StK3/0bGx/9SyzP/WstP/1K/S/3g0QP+CPUP/gDo8/4Q/Qv+GQEP/hkBE/4dBQ/+IQkP/iUJL/4lBUP+MQVr/i0Jl/4o/aP+KQmb/kk9j/5hYY/+eYWP/n2Rk/6ZgY/+qXmD/q19i/61gZP+uYnT/rmN9/69ihf+sY4b/rmGF/65ihP+teIP/sIaF/7KKh/+yi4j/tImI/7iJif+9iY7/xIui/8eKqP/LiKv/0oqx/9OXsP/Rp67/0bGu/9Cvr//OqrL/zqe9/8els//GoLj/z6m8/2AkP/9jKED/YCM6/2coP/9oKkH/ays//20sNf99NkD/fTxE/35BS/9+P1D/gTpT/4pHYf+NTGL/jkhk/5FPY/+dXGT/n2Bk/6djZf+tZGf/rWVl/7FlZP+yZWz/r2R4/7FjhP+vY4X/sWOG/7Fihv+wdob/sIKI/7ODif+xhIj/sYSI/7WHif+6iI//voCT/72Clv/ChZ//xY+n/76Nl/+1ipf/t46f/7SNqP+zh6r/sImq/7OXqP+8n6j/yKao/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==';

    // 查询选择器
    const querySelector = document.querySelector.bind(document);
    const log = (msg, type = 'info') => {
        console[type](`[倍速优化] ${msg}`);
    };

    /**
     * 等待DOM节点出现
     * @param {Function}    selectNodeName      - 节点选择器函数
     * @param {Function}    callback            - 节点出现后的回调函数
     * @param {number}      [maxAttempts=200]   - 最大尝试次数
     * @param {number}      [timeout=200]       - 检查间隔(ms)
     */
    const waitForNode = (selectNodeName, callback, maxAttempts=200, timeout=200) => {
        let attempts = 0;
        const tryFindNode = () => {
            try {
                const selectNode = querySelector(selectNodeName);
                if (selectNode) {
                    callback(selectNode);
                    return;
                }
                attempts++;
                if (attempts < maxAttempts) {
                    setTimeout(tryFindNode, timeout);
                } else {
                    log('加载视频节点时间过长，无法修改倍速菜单，请刷新页面重新尝试')
                } 
            } catch (e) {
                log(`等待节点出错: ${e.message}`, 'error');
            }
        }
        tryFindNode();
    }


    /**
     * 调节视频倍速
     *
     * @param {Element}     videoNode   - 视频节点
     * @param {number}      rate        - 倍速字符串
     */
    const setVideoRate = (videoNode, rate) => {
        try {
            if (!videoNode) {
                throw new Error('视频节点不存在，请重新测试');
            }
            videoNode.playbackRate = Number(rate);
            const rateNode = querySelector('.bpx-player-ctrl-playbackrate-result');
            if (rateNode) {
                rateNode.innerText = rate + 'x';
            }
        } catch (e) {
            log(`调整倍速失败：: ${e.message}`, 'error');
        }
    }

    /**
     * 初始化样式
     */
    const initStyle = () => {
        // 创建style元素
        const style = document.createElement('style');
        style.textContent = `
            .yww-container {
                position: fixed;
                right: 10px;
                top: 20vh;
                z-index: 1000;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .yww-index-button {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-image: url('${mainImg}');
                background-size: cover;
                background-position: center;
                opacity: 0.75;
                border: none;
                cursor: pointer;
                box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
                transition: transform 0.3s, opacity 0.3s;
                position: relative;
                z-index: 2;
            }
            .yww-index-button:hover {
                opacity: 1;
                transform: scale(1.1);
            }

            .yww-value-button {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: #fff;
                border: 2px solid #CD9DFA;
                color: #CD9DFA;
                font-size: 16px;
                font-weight: bold;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
                transition: transform 0.3s;
                position: relative;
            }
            .yww-value-button:hover {
                transform: scale(1.1);
            }

            .yww-popup-box {
                position: absolute;
                right: 60px;
                top: 50%;
                width: 300px;
                background: white;
                border-radius: 8px;
                padding: 15px;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
                transform: translate(20px, -50%);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 2;
            }
            .yww-popup-box.active {
                transform: translate(0, -50%);
                opacity: 1;
                visibility: visible;
                z-index: 4;
            }

            .yww-button-grid {
                display: grid;
                grid-template-columns: repeat(8, 1fr);
                gap: 8px;
            }

            .yww-rate-button {
                width: 30px;
                height: 30px;
                border: 1px solid #ddd;
                background: #fff;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s;
            }
            .yww-rate-button:hover {
                background: #f0f0f0;
                transform: scale(1.05);
            }
            .yww-rate-button.active {
                background: #e6f3ff;
                border-color: #1890ff;
                color: #1890ff;
                transform: scale(1.05);
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * 初始化调节按钮
     * 
     * @param {*} container 按钮容器
     */
    const createRateButtons = (container, videoNode) => {
        // 创建并添加主按钮
        const indexButton = document.createElement('button');
        indexButton.className = 'yww-index-button';
        container.appendChild(indexButton);

        // 创建并添加值按钮
        const valueButton = document.createElement('button');
        valueButton.className = 'yww-value-button';
        valueButton.id = 'yww-valueButton';
        valueButton.textContent = indexRate;
        container.appendChild(valueButton);

        // 创建并添加弹出框
        const popupBox = document.createElement('div');
        popupBox.className = 'yww-popup-box';
        container.appendChild(popupBox);

        // 创建并添加弹出框按钮
        const buttonGrid = document.createElement('div');
        buttonGrid.className = 'yww-button-grid';
        buttonGrid.id = 'yww-buttonGrid';
        popupBox.appendChild(buttonGrid);

        // 创建提示框中的数字按钮网格
        for (let i = 1; i <= 30; i++) {
            const rate = (i / 10).toFixed(1);
            const button = document.createElement('button');
            button.className = 'yww-rate-button';
            button.textContent = rate;
            // 初始化速度按钮
            if (rate === indexRate) {
                button.classList.add('active');
                selectedButton = button;
            }
            // 点击按钮后调整倍速
            button.onclick = (e) => {
                e.stopPropagation();
                if (selectedButton) {
                    selectedButton.classList.remove('active');
                }
                setVideoRate(videoNode, rate);
                button.classList.add('active');
                selectedButton = button;
                valueButton.textContent = rate;
                popupBox.classList.remove('active');
            };
            buttonGrid.appendChild(button);
        }


        // 添加主按钮点击事件
        indexButton.addEventListener('click', (e) => {
            e.stopPropagation();
            popupBox.classList.toggle('active');
        });
        // 点击弹出框内部时阻止事件冒泡，防止触发外部点击事件
        popupBox.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        // 点击值按钮时显示控制按钮
        valueButton.addEventListener('click', (e) => {
            e.stopPropagation();
            popupBox.classList.remove('active');
        });
        // 点击页面任意位置关闭所有弹出框
        document.addEventListener('click', () => {
            indexButton.classList.remove('active');
            popupBox.classList.remove('active');
        });
        log('倍速优化已加载');
    }

    /**
     * 初始化流程
     */
    const init = () => {
        try {
            // 初始化样式
            initStyle();
            // 等待播放器加载完成
            waitForNode(
                'ul.bpx-player-ctrl-playbackrate-menu',
                () => {
                    const videoNode = querySelector('video') || querySelector('bwp-video');
                    if (!videoNode) {
                        throw new Error('未找到视频节点');
                    }
                    // 创建容器
                    const container = document.createElement('div');
                    container.className = 'yww-container';
                    document.body.appendChild(container);
                    // 创建按钮
                    createRateButtons(container, videoNode);
                });
        } catch (e) {
            log(`初始化失败: ${e.message}`, 'error');
        }
    }

    // 执行初始化
    init();
})();