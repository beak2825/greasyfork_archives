// ==UserScript==
// @name         PANDER-NOTIFY
// @namespace    https://greasyfork.org/en/users/13769
// @version      1.4
// @description  Pander notify script
// @author       saqfish
// @include      https://www.mturk.com/mturk/
// @grant        GM_log
// @require      http://code.jquery.com/jquery-2.1.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/12382/PANDER-NOTIFY.user.js
// @updateURL https://update.greasyfork.org/scripts/12382/PANDER-NOTIFY.meta.js
// ==/UserScript==

var loggedStatus = false;

if (!document.getElementById("lnkWorkerSignin")) 
{ 
    alert("You're logged in - Go into incognito mode or log out!");
    loggedStatus = true;
}
var timeintervals = [];
var seqinterval;
var winders = [];
var Timers = [];
var playtimer = false;


base64string = "UklGRuQ1AABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YcA1AAAS/xL/GP/+/hL/BP8S /wf//v4S//v+B/8H/wf//v4J/xL/DP8V/wr/Ff8H/wf/B//7/gf//v4S//7+/v4E/wf/B/8H/wT/ B//+/gf/B/8H/wT//v4H/wf//v4J/wz/B//+/gn/B/8H/wf/BP/+/hL/B/8H/wf/+/4E/wf/Ev8H /wn/Cf8E/wT//v4S/xL/Ev/+/gf/Ev8K/wz//v4f/xL/Cf/+/vv+Ev8J//7+/v4H/xL/Ev8H/wT/ BP/x/gT/+v4H/wT/Ff8V/xL/Ev8E/xj/BP8E//7+BP8H//7+/v4E//v+/v4E//3+BP/9/vv+BP8E //T+/f4E//v+BP8H//T+Cv8E//7+Ev/+/v3+9P70/gf/9P4H/wf/Ff8K/xL/BP8S/xX/B/8V/xL/ Ff8H/wf/BP8K/wf/+/4S/wf/Ev8H/wf/B/8H/wf//f4S/wf/B/8K//7+Cv8H/xX/B/8K/wr/B/8H /wf/BP8E/wf/BP8E/wf/BP/+/gT/BP8S//7+BP/+/vT+BP8E/wf/B/8H//H+bP+oAPQBFANbA0IC wP93/Pr4W/Yh9dj1tfjb/PEBrQY4C/0MTQtZB4EBivsR9m7yVfHL8sz2SPwhAn8HFgs1DLUK2AZn AXX7GvZ78ljx1fLP9kj8AAIyB5EKoAtMCooGTwGg+3X2DvMK8lzzIfdr/BUCMgeSCqoLVgqNBl4B /fsK95fzgvIH9LX3o/zdAcAGHwo2C8UJGAYzAfz7FPeX85HyB/Ti97H8xAGTBq8JpApqCegFJgEn /Fj3LPRG84H0DfjP/NABmQavCa4KdAnrBSYB7vut9hfy3u7v7brvsPS0/MYGDhE9GR4deRsnFPcH Dflt6m3kZ+M34qTkqvITBI0UtCCyI3ckDxpTC/L5veml5CTjFeJm5SL01ATUFJIgQCTfI6sZagss +jDqd+QP4/Ph6uV39HcEHRRwH1AkFCKsGJsKjfkY6kDkBuPT4cvlB/RqA4USjh1eIk8geBfwCfL5 GOtA5DHj8OGw5sb0wgO1EngdVCI1IGEX6QkI+mnrTeQx4/DhfudF9cUDWBKZHDkhEh9/FmgJ3vlz 60PkOuPq4W/nOfW2A1gSwxzDIS8gQRihCwr8uuxw5FTj0+ED4ynug/6KDl4cWiNJJCsduBCEAJrv GeWs4//hS+JS67j8DQ2MGyMjGSQKHWcQIQA27wLlruPg4VHii+vL/PMMTxvpIqwjxhwwEAcAau8P 5Zjj8+Fk4gDsDP0jDVkb3CKLI2wc9Q8XAATwUOWO4wnisuJx7Tb90Aw1GoEhCCKHG20P6P8M8FPl l+P94avib+04/c0MLBpyIfwhWhteD9P/+O9Q5ZfjCeLW4tjtff39DEIadSH8IVMbVw/T/wTwUOWX 4wDiu+JZ7ej8QQyhGQQh1iGgGy0QRgHJ8R7mleMu4k7iqusG+2EKIxgiIHwhyhunEPEBhfKA5qXj WuJE4rDrBvtmCkMYTCCNIeQbpxDoAX7yg+aY41riTuLS6xz7fApGGEIgkyHWG6cQ2QFu8nbmq+Na 4lri6Osj+4MKNxgpIHUhrRt8EK4BT/Js5pjjWuJ54l/sd/u4CkMYFSBcIZ8bZxChAU/ybOaY41fi cuJr7IH7wQpLGBcgXCGfG10QlwEt8lbmjuNE4nLibux7+74KSxgfIFwhnRttEKQBT/Js5pXjV+Jw 4mLsRfthCtAXmh8BIXIbiBD+AeDy2uaX41riheJu7Bn7KQqCF10f1yBdG4YQCQLp8t3mlONk4nni YuwX+ykKjhdqH+EgZht6EP4B3fLE5o7jZOKF4lbsHPspCoIXbR/eIFwbehD7Adny0+aO41rifOJx 7Cb7NgqYF3of9yB5G0AQbAEU8l/mi+NO4ojip+y4++EKOhgfIDIhaRtPEF4BFPJW5n/jQuKF4rzs xfv4CnQYIiBcIX0bIhBJAenxKOaL4zTifOK17MD7/ApnGBcgRyFpGxkQMAG88Q/miOMt4n7i0OzY +xkLeBglIDshYxsWECkBufEe5njjJOJ+4vjsNvx2C9gYkiBzIWkb8A/TAEnx1+Vq4xXifOLy7DP8 dgvjGH0gqSF9G8gPkQDl8J7lauP24X7iDe1k/M4LQBnHILYhcxu7D4oA1vCU5Wfj8+F84iPt3vy3 DJoaVyJuI6AcOhAwAL3v/+Rm47vhN+JA7Lv8mwy0GocitSOXHPwPl/8I77vkR+Oj4S3iLewZ/SAN XxvJIg0k8xwKEL3/+e7H5DvjmeEq4kPsZPy2C7cZdSG5IsMcUhGQAjPz8OZH4yHiseFW6VT2cQPm D78YBx0LG6kTCAhl+k3tpOQG4/bhyeew9EkCGRCAGbIdqRsGFEUIc/pN7afkD+ML4tXn3vScAp0Q BRowHhIcVBRRCCz6xuxt5B7j9uGb5970xwLOEDgaZR5SHHgUWAje+RHsMeQe493hveaj9BoDaBHq GuIerxylFGkI9fkb7EDkMePm4YPmnPR0A/MRfBtAHwwd0hRYCJD5XOsV5CfjyeFo5pD0iQMPEowb YB80HUAVAwnA+mXtx+Qe40viiugH9N//fQswE4kWWRWDELkJeQI//Kn36PTR8yn0AfYZ+SP9mgGo BXIIYQlMCEMF4gDk+273YvSA89X0L/jS/MQB+wW1CHgJOwggBbUAuftV91P0Z/PI9Db46Pz0ASYG 4gisCU4IMwW+ALb7TvdJ9Fzzw/Q2+Pb8BwJQBgMJxwlyCEEFtwCp+yf3CPQc8470I/j2/AcCWgYQ Cc4JcwhDBbIAk/v99tnzDfON9CP4DP00AooGMQnjCX8ITQW1AJP78fbR8/XyafTo97v80AEmBt8I nglbCGQFVgEA/T/5tvbk9bn2zvif+2f+wQBJAgoDDQOCAnYBNwDE/k79EPxO+zH7zPsA/aL+YwDX AbwC1AIfAr4AB/85/c/7DfsL+8D7Cv3E/n0A7gG8AsACCwK1APH+IP25+/T69Pqj+wn9u/59AN4B vALIAgsCqwDe/iP9tvvt+ur6ovsP/cT+hAD6AdEC3QIcArUA3v4W/aL71fre+p/7A/3E/oQA9AHK At0CHAKyANj+Cf2N+9f61PqT+/38u/6EAPEB3QLgAigCvgDo/iD9r/vt+s76jPvS/GD+6f8mAeUB /QGNAasAj/93/r79L/0J/Rn9ff33/W3+9P52/8n/9P/0/6//LP+W/gb+h/1Q/WT9qf08/tr+gv/p /yMAAgCv/yL/iv7r/X79Tv1d/bX9M/7k/nn/9/8qABMAvP8y/43+5P19/Tb9WP21/Tz+6P6F//f/ JAATALP/K/+K/u39ev05/VH9sv1I/uX+j//0/zYAFQDH/yn/jf7t/XH9Qv1a/bX9SP76/pn/AABA ACAAx/8r/3f+5P16/UL9WP2y/Tz+5/6F//7/NgAXANP/S/+4/jL+y/2Q/ZP91f0l/pb+8f44/1j/ bP9Y/yv//f7Q/pb+c/5S/kn+VP6A/qz+5P4V/zX/Nv8y/xL/2v6N/mf+P/4z/k/+bf6q/tv+Ff8s /0L/LP8Y/9v+ov5q/j/+PP5P/m3+o/7k/hz/Nf9C/z//DP/R/qD+av5I/jn+T/52/qP+3v4V/yz/ Qv9C/xL/x/6W/mf+Rf4z/kv+bf6g/tr+HP81/0T/Nf8J/9D+iv5g/jP+Mv5S/nP+rP7u/hz/Qv9J /yz/Ev/R/qD+YP48/in+PP5j/o3+0P70/h//H/8r/xL/8f7C/qD+gP52/nb+gf6g/qr+wv7Q/tv+ 3v7n/tr+x/67/qL+oP6N/pT+lv6Z/rv+2P7R/t7+2/7n/sf+uP6q/qD+iv6N/pb+qv6x/s7+5P7u /uX+2/7H/sL+rP6g/pb+lP6W/qD+u/7O/uT+5/7n/uT+u/67/qr+lv6K/o3+lv6q/rj+x/7a/uX+ 3v7k/tj+xP6s/qD+lP6K/pb+ov67/s7+5P7e/uf+2/7T/rH+rP6N/oP+lP6N/qz+wv7H/u7+8f7x /u7+2v7O/rj+oP6W/pb+oP6j/rj+wv67/tr+x/7Q/tD+xP64/rj+r/6s/qz+rP6s/rv+xP7O/sT+ zv7O/sT+uP64/lX/hADuAf4COwM/Asf/a/zl+Ev2F/XK9Z34vvzEAX0GAQvNDCALNQddAV/79fVP 8irxsvKs9hP85wFLB9QK+wuOCqAGMAFS++71WfI08bLypvYT/NAB+AZkCloLEApRBiUBivte9vjy 6fFD8wn3PvzaAf0GYQpmCwoKZgY5Ac/76vZ081Hy2/OB9178lAFzBtEJ7gp0CdUF+QDC+9n2a/Ni 8s/zqPdk/H8BUAZqCVYKJwmoBeIA5/sU9+/zBPM89Nj3g/yNAVMGcQlhCh4JngXPAIP7HfZi8TDu F+3v7uXz5vv4BVwQexheHL0aaBNJB1740unw4/niu+EV5AryggPvE0IgcCP4I34Zywpr+TrpNOSy 4r3h6+Sj81YEVBQiIPgjbiMxGfgKo/m66RLksuKZ4YXlBPT5A58T/h7WI5khOhgtCjD5rOn546vi jOFm5ZrzBAMWEisdBiL4HxEXlQmN+cHq/OPi4qLhXOZ39GcDYhIhHe4h0R/7FosJrfkM6/zj2eKb 4SDn9PRxAwASPhzkIKweGBYGCYH5JOv54+Dim+Eg5+30cQMdEo4coiESICsYhwvu+5bsLeQN45nh suLx7WD+YA4nHBMjDyTxHHoQSwBl79/kYOOl4f/hC+t6/NMMXBvWItYjvRwZEOD/+e675FHjm+EJ 4kjrkPywDAsbnCJmI38c6w/K/yPvx+Ra46PhHuLD69L84AwhG5kiQCMuHKgP1v+97wLlR+O74XLi IO3r/IAM5xk+IcAhJhsdD6b/yu8M5Urju+Fp4iPt9vyKDPIZOyHAIRgbEA+F/73vD+VT48fhkuKh 7UL9vQwIGjQhtiEVGxIPjf+97wLlSuPQ4Wni/+yQ/PALUxnHIIwhZhv0DwABjPHa5V3j/+EJ4l7r wvoTCt0X5x87IZ8bcBCxAUPySeZg4yHiCeJo68L6KQoAGP8fXCGTG2cQrgFD8jvmYOMV4hfii+vX +jYKAxgBIEohihtmEJcBLfI05mDjHuIX4qbr8Po9CgAY5B8yIXIbNxBnAQryMeZm4xXiQeIq7D77 gwoNGOQfGiFdGzcQcwEU8jTmaeMV4kTiKuw++4MKGRjqHy8hZhsiEGAB6fEb5mbjFOJB4jTsR/uG Cg0Y4B8hIWMbLRBsARfyO+Zm4w7iQeId7AP7IgqOF20fyiBIG0oQzgGs8qTmXeMk4kTiMeze+ukJ SxcrH6cgLBtGEM4BrPKZ5l3jJOJE4jTs4frpCVUXKB+cICwbQxDHAabyluZd4yTiROIt7O366QlY FzIfpyAmG08QxwGe8pnmXeMt4kTiMez3+vwJaxdDH8ogORsWEDwB3PEl5lTjFeJa4m7sd/uqCgMY 2x8BIUIbKRAzAd/xJeZR4xfiQuKC7Iz7wQo6GPUfLyFFG/IPGQGw8fLlUeP/4ULiguyW+8EKNxjq HxghORvwD/kAhPHh5VPj8+FX4prsovvbCjoY9R8LISYb3w/5AIzx5OVQ4/PhUeK87Pz7SQulGFYg XCFDG84PnAAR8aHlPePg4VrivOz8+zsLoRhPIHIhTxuYD2cAt/Bp5T3jyeFa4tLsNvygCxAZnCB/ IUwbhQ9aAK3wWuU748nhTuLs7LT8eAxsGioiQCNqHAoQ9/+H787kMeOZ4RTiHeyZ/HgMkBphIogj cxzFD3D/2+6b5B7jf+H24QDs6/z2DC8bnCLiI70c3A+N/8bum+QP43jh8+ET7DD8jAuYGUchhyKZ HBwRZgIX88bmHuP/4YzhM+kw9lEDxA+eGN8c3hqHE94HL/oj7XDk6eLR4ZvnhPQcAvQPVhmIHYkb 7RMYCE/6Ie2D5Pni3eGq57D0cgJzENsZBh73GzMUKwgL+pvsQ+T34tPheOe89J8CqRASGi0eLhxX FC4Ivvnm6xLkAOO94aLmffTpAj4Ryhq4HokcjRQ7CMX5/usb5AzjuuFo5nr0RAPGEU8bHB/jHLgU Qghh+Ubr8uMA47HhROZ99GcD5hFmGz0fEx0JFdYIk/pG7aXkA+Mq4mbo4vO5/1MLAxNmFjMVWhCL CV8CFPyN99H0tPMI9Mz16/gJ/YoBjQVYCEcJKgggBb4AuftV90r0XvO89Bb4sfyqAd4FnwheCSEI /wSQAI37Hvcd9DPznfQE+Lv8wQH4BbMIiAk6CA0FkQCZ+yf3FvQm85D0A/jI/NoBIwbiCKEJWAgp BZQAjPv99vHzAvN69PX3z/zuATkG+givCVoIIAWaAHf74va889/yYvQA+N78FQJpBhAJuwliCCwF kABr+8/2qPPS8kP0zPel/K0B/wWzCHgJTAhNBTMB3/wc+aP2zPWg9rX4fvtI/p0AKALnAucCWAJg AQwAmf4j/fD7OPsQ+6z76PyN/lAAuwGcArkC/QGoAOT+IP3A+/T65Pqi+/b8oP5jANABsAK8AgQC qADa/hb9lvve+tf6k/vl/Jb+VwDNAaMCsgL9AZEA0P4D/aL71/rM+oz76Pyi/mYA1wGyArMCBwKa AM7+AP2M+7b6vPp+++j8oP5kANEBuQLKAvsBkwDE/ur8a/uw+rD6e/vV/KL+ZgDaAbwC0QIVAp8A 2P4T/Zn71/q/+nH7qPw8/r3/AgHEAeUBdgGQAHn/Yf6K/SD96PwK/W394f1n/u7+ZP+y/9//0P+P /xX/dv7r/W39Nv04/ZP9G/67/lX/yf8AAOn/o/8V/3P+3/1m/SD9OP2a/SX+wv5f/9z/AgAAAKb/ HP92/t/9bf02/UL9mv01/sf+Y//f/xMA/v+c/wz/bf7f/Wb9I/05/Z39Mv7O/mz/3/8VAAAApv8c /2r+2P1m/S/9Of2d/TL+2P52/+D/FwAMAKn/HP92/tj9Zv0q/UD9mv0i/tD+Y//m/yAAAgCw/yz/ ov4G/qv9ev2E/b79Gf6K/u7+K/9O/07/OP8V/+T+ov6A/l3+Rf48/j/+Z/6K/tD+9P4o/yn/KP/7 /sf+jf5S/jL+Iv41/l3+lP7Q/vT+K/8r/x//AP/E/pT+Uv45/iX+Of5g/pT+0P79/h//H/8f//H+ wv6K/l3+Kf4y/jD+Xv6Z/tj++/4o/yv/H//x/r3+g/5U/jn+HP4p/l3+gf7O/gf/H/81/xP/+v7C /or+SP4c/hn+Jv5S/or+zv76/h//K/8c/wD/zv6D/lL+Mv4i/jP+Xf6U/sT+8f4S/x//Ev/x/s7+ qv59/mH+YP5h/nb+jf6g/qz+u/7Q/sT+zv7O/rj+qv6N/oD+dv52/oD+jf6g/rv+u/7Y/tj+zv7E /qP+lv6N/oD+d/6A/or+qv7C/tD+0f7a/sf+u/6s/pb+iv50/nb+gP6N/qz+u/7H/tj+2P7H/sT+ ov6N/oD+dv50/oH+jf6q/rH+zv7Y/tj+2P7O/qz+mf6U/nf+ff6D/o3+oP6x/tD+2P7O/tj+xP6s /qD+lP6K/n3+gP6U/qL+u/7E/tr+x/7O/sL+rP6g/o3+iv6K/or+lv6Z/qz+uP7C/sT+xP7C/rj+ uP6q/qr+oP6Z/qL+ov6g/rj+u/64/rj+u/7C/rH+u/4//3sAzgHgAi4DHwK5/2784vhI9v/0zPWB +LH8ugFpBvgKwwwWCyUHSQFV++71TfIk8Z3ymfYD/NoBOAfRCusLegqKBhwBSPvk9VnyKvGp8qD2 Bvy6AdsGSQpHC/wJPAYYAXv7S/bi8tzxJvP29jD8zQHuBkwKRwsGCjwGGwHC+9v2a/NZ8tjzevdU /JABZgbMCd4KagnLBekAr/vS9mvzWPLY85r3ZPx4ATsGWwlTChkJjQXPAMz7APfl8/jyMvTB9278 fQFFBmcJUwobCYQFtQBr+wf2VfEa7hTt5e7b89j79QVGEGIYSByuGl4TPAdY+Ljp5uPs4qXhCOQD 8nED2BMiIFoj6yN0Gb8KVvkx6SrktOKj4d3kmvNMBE0UFSDfI1ojMBnsCpf5rOkG5KviguFy5fTz 7QOKE+UeyyOWISsYHQoc+aLp6eOc4oLhXOWX8wEDERIhHfwh2x/9FnUJhPmn6vLjyuKP4VPmafRb A0sSBh3ZIbof5RZ/CaP5Auvy4+LiluEU5+r0ZwPtETQc1CCrHg8WAQmE+Rjr5uPW4pvhFOfe9GcD GxKCHI8h9R8UGH0L2vuF7B/kBuOG4aji4u1I/lEOERwJI+4j0xxkEDcAVO/H5FrjouHz4fvqcPzJ DEgbySK/I7AcDBDH/9vupeRH45bh/+Ew63r8sAz/GpkiWiNpHN8Puv8V77vkSuOZ4Rfiueu+/N0M DhuLIiojGByYD8r/se//5DvjuuFk4iPt4fxuDOUZMiG5ISMbEw+T/8Dv/+RH473hZOIq7fP8eAzl GSQhrCEOGw8PgP+q7wvlR+O04YbilO0q/aMM9RkXIZYh/xr9DoP/ru/15EfjuuFa4vjsjfzmC04Z sSB8IVAb3w/vAH/xzuVT4+rhAuJc67b6CQrQF9EfJSFzG1oQmgE58jTmXeMU4v/hYeu8+h8K8Bf/ H18hphtnEJ4BNPI75lTjFOIU4ovr1/owCgAY9R9FIYAbTxCLASvyMeZm4xfiFOKj6976QArzF+Af MiFyGy0QagEK8iXmVOMX4jTiHew4+3wKAxjbHxohUxspEFsBAfIl5l3jAOIt4h3sO/t6CgcY3R8h IVAbIBBJAebxEeZU4wniN+Ix7D77gwoRGN0fFyFZGy0QagEK8jTmWuMO4jfiFuwG+x8KmBdgH70g NhtGEMcBqfKZ5lPjJOJE4jTs5PrmCUEXJh+ZICMbOhDEAZjyluZT4yriN+Id7Nf63wlBFysfkCAf GzcQxAGb8pPmXeMh4jviMeza+ukJSxcfH5kgFRstEMQBlPKP5lrjGOJH4jHs7fr1CVgXMh++IDAb ExAwAdnxHuZT4wDiO+Ju7Hv7pwoAGN0f9CAwGwwQKQHc8RnmUOMJ4kHibuyB+74KMBjnHyQhTBvo DxkBsPHy5Urj/OFB4m7sd/uqCi4Y3R8aITkb3w/vAHjx2uU94+rhTuKO7KL71wo3GOQfASEYG9MP 7ACO8d7lPePz4U7ixuzz+zsLoRhSIE8hORuyD58AEfGe5TPj0+FO4rPsA/w7C54YUiBmITwbhQ9X AKrwXOU748nhV+LV7Cn8kwsQGZIgfCFMG44PTgCj8GPlM+PT4Uvi5uyx/HUMWRobIjYjcxwKEPf/ hO/H5C7jhuEA4hPsjfxyDIQaVyJ/I2kcxQ95/97ukuQP43jh8+Hv6+H86gwvG44i1iPGHOYPjf/I 7o/kD+Nj4fPh/us2/IkLmBlUIYQifxwcEV8CBPPG5hnj9uF54SnpGvZEA7sPlRjQHNsaexPTBy/6 F+1k5Nni0+GP53r0CgLrD0cZgh1zG98TDghC+iHtd+Tj4ubhpeew9G8CaRDeGQMe7hszFCEI/vmY 7EDk9uLQ4WznpvScAqAQCBogHiQcSxQhCLv52esJ5ADjpeGi5nf05wI0EbEaqx5zHHUUQgi5+dzr G+T64rHhaOZu9D0DwxFIGx8f3ByuFDsIZPk86/Dj+eKj4THmZfRbA+YRaRsyHxMdCRXiCJP6Ru2n 5ADjFeJc6OLztf9QCw0TZhYvFVYQfwlMAhH8h/fG9K3zEfTK9ev4/fx/AZAFTgg9CRgIHQWrAML7 TPdD9FnzufQZ+Lj8pgHhBZwIZwkeCPUEkACf+yf3H/RD85f0A/ix/LoB+QW8CH8JNwgJBZAAk/sX 9xz0MPOa9Ab4yPzaASMG4giXCUUIFAWTAH77+vbl8//yd/T498j86gE5BukIrAlFCB0FhwBx+9L2 wvPV8l/08vfS/AcCUwYNCcIJYgggBZMAaPvP9qvzzvJJ9Mj3nvytAQIGswh/CTcIRAU8Aej8KPmg 9sD1nPa1+H77SP6dACgC5wLgAlUCVAECAJn+Kv3k+yP7C/uZ++j8gP5DALoBmgKwAvEBmgDY/iD9 rPvt+t76n/vz/Jn+YwDEAZwCnQLoAZoA2P4W/aL71frX+oz76Pyg/lcAwQGTArAC8QGQAND+AP2N +9T6v/p1+978lv5jAMQBqQKzAvoBmgDE/gP9k/vA+rb6ifvV/KD+ZwDXAbkCxwIEAooAsf7o/H77 sPqn+mv72/yW/l0A2gG5Ar4CBwKdAND+AP2K+8v6s/po+7H8Of7H/wUBsQHlAWoBkAB5/2r+lv0N /d/8DP1m/eH9Z/7k/l//pv/d/9P/g/8S/3b+6/1t/Sz9L/2Q/Q/+wv5Y/9P/AAD3/5n/+/5g/sv9 Wv0s/Tj9mv0i/rv+Wv/K/wAA9/+c/xz/dv7f/W39Nv1E/ZP9Jf7O/mP/3P8TAAAApv8c/3b+2P1k /Sz9QP2T/SL+u/5h/9z/CQD3/5r/DP9t/tj9Wv0q/Tb9kP0c/tD+dv/m/xcAAACm/xX/c/7Y/Wb9 IP05/Zr9HP7O/l//0/8JAAkAqf8p/6D+D/6p/Xr9ff2y/RL+dv7Y/h//Qv9Y/z//Ff/k/rv+ff5S /jz+MP5I/mr+jf7Q/vr+KP8o/xz//f7E/o3+YP4y/iX+Nf5d/or+2P7+/iv/LP8W//3+xP6D/l3+ HP4l/in+Xf6U/sT++v4c/x//HP/6/sL+iv5P/i/+Iv45/lf+lP7Q/vT+KP8r/xz/+v7C/or+Sf4l /iX+Mv5d/pb+u/4E/x//Mv8f//H+uP59/jz+L/4b/jL+YP6D/s7+9P4f/zL/H//6/rj+gP5P/ib+ Iv4o/k/+gP67/t7+Ev8f/wz//f7Y/rv+lP52/mr+Z/5q/or+iv6s/rv+xP7Y/sT+xP64/qX+g/6A /oD+bf53/pT+mf64/sL+xP7Q/tD+u/6i/o3+ff5z/mr+dv6N/qr+wv7O/tD+0P7O/rv+ov6D/oD+ ff52/oD+g/6i/rj+0P7H/tj+xP7C/qL+lP6A/n3+dv6K/o3+ov67/s7+0P7Y/s7+wv6q/o3+gP59 /n3+d/6U/qL+u/7Q/tr+5P7Q/sL+rP6N/oD+dv52/n3+lv6s/sL+0P7R/tr+x/7C/qr+oP6K/oD+ iv6N/o3+lv6q/rj+zv7C/sL+uP67/rj+mf6i/qD+ov6N/pb+mf6q/qz+uP67/rj+u/67/qP+5/5Y /wwAkwB+ACoAH/+d/Rr8A/ti+o/6tvu1/TAAjwJUBA0FrgTdAgwApfx6+TT3VfYn94r5Cf0FAbsE Swc5CF8HogSRABr86fcB9e/zF/Uc+IP8dgHrBRAJAAriCJIFzwAD+2X1pPFm8BPyPvbz+0kC8Qe9 C/MMWgtIB4EBjPsa9nvyVfG/8rn2Jvz0AVIH6QoCDIgKpAY/AWv7EPZn8knxv/LD9iz8BAJiB+sK EQybCqoGPwFl+/r1bvJC8cjyr/Yp/AQCYgcBCxsMngqrBikBL/ty9SfxG+9979nyc/im/40HSg6S En4TbRDCCasAX/Y37QHnAeVE6L3vUfpsBksR5RjPGwAZ5RAKBVX30er84/niTuJP6m73twWpE/0c MiFHHkAVnAe/92rp5uPD4rThV+dr9pYG4BYyIWEi5SRZGpgKW/ix50DkOOKZ4cTjvPIWBW8V+iCF Il0kGhmsCcn3xucG5C7iguGO5NjzTQWKFfAgIyPuI+AYEAo5+Cvo/OM74njhgOSA87EEAhW0IDkj 3yPjGAAKLfgY6PLjN+Jg4XnkgPO5BB8VtCDcIlAkzxkCCzb5e+j/4zviVOHW4u7vcgJaEywgFCLl JIIcnA08/PXpH+SI4kfhJOJS7YAAoxGDH/8hwiR7HaAOcf2x6jTkq+Iy4d3hM+sK/2YQxR78IY0k yh0DD/n9J+s35MDiO+HQ4ZrpxP2ED1MezyFtJF4emA/b/uPrTeTj4j7h0OG46e39uw92HrkhYCRD HmMPlv6360zk2eI+4cfhHur6/WMPJh4RImAk1h1LD6D+JexD5OPiNeHT4UDq2P0SD9gdSyJdJPcd aA/x/nnsQ+T34jXh0OEV6lj9pQ6rHUQiUyQNHsgPkP8u7VfkD+M+4b3hi+l3/LIN5hxhIkkkWx5D EC0A1u1k5B7jSuG64VbpFvxODYIccSI6JCQeRhBdAITuheQe40jhpeG96eb70Az6G3giNiQNHo8Q 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 lP3O+536LPpl+l77u/x5/iQAlwGFApoC5wFwAKL+z/xR+4P6g/pO+6/8c/42AK0BjwKaAtoBZgCP /rL8UfuG+oP6Tvux/HP+NgC3AYMCnALQAXAAjf7F/Ef7hvqD+kf7pfx2/jcAtwGcAqYC2gFmAHf+ nPwv+276cfo7+6X8Vf4TAHYBSQJYAqMBYwC4/gP9o/vh+r36UfuB/Pz9k//1AM0B5wFqAVAA7v56 /T78e/tO+7j7o/zY/R//OQDvADIB4gAtADL/Jf42/Zv8VPxw/Nv8h/1P/hX/pv/3/xMA3P92/+T+ M/6r/UL9DP0W/XD99/2Z/kL/v//3/9//gv/u/jz+sv04/f38Cv1t/Q3+rP5Y/9D//v/f/4X/7v5P /qn9Qv0J/SD9cP0D/qr+S//J/wIA6f+F//H+PP6p/Tj9Cf0Z/XD9A/64/lj/yv8JAOD/g//9/lL+ wf1Y/Q39IP10/QP+ov4y/6b/1v/T/4P/B/9t/uv9dP04/UL9hP3t/X3+/f5s/6//mv9m/wf/g/4Z /sv9h/2Q/bX9Df5d/tP+BP81/0v/Nf/9/sL+gP4y/gb+5P31/Q/+PP52/qr+2v79/vv+8f7O/qL+ Z/4c/vn99/35/TL+Z/6q/uf+/f4H/+j+0P6W/kn+Jf76/QP+A/4y/mr+ov7a/vH+B//x/sT+jf5X /iX+A/73/Qb+Mv5g/q/+6v7x/hX/+v7Y/qD+Y/4v/g/+9/38/SX+Yf6g/tD+8f4E//H+xP6W/l3+ Jf4N/vn9Bv4v/mD+lv7O/u7+/f70/tD+qv5q/jz+G/4Z/hv+MP5n/o3+rP67/s7+x/6v/pb+ff5g /k/+Rf5F/kj+V/55/o3+ov67/q/+u/6s/qD+iv5q/mr+Sf5U/lT+c/6A/pT+qv6v/q/+rP6i/o3+ dv5d/l3+Sf5g/nb+jf6g/q/+r/6x/qP+mf6K/nP+YP5d/mD+Z/55/oH+oP6q/rj+u/6j/pb+gP5q /lT+Uv5S/mD+Xv59/or+ov64/rj+rP6g/pT+dP5q/mD+Xf5X/nb+iv6W/qz+rP67/qz+ov6W/oD+ av5g/mD+Xf5z/oD+lv6v/rj+rP6v/o3+iv6N/nb+av5q/nb+ff6N/pT+lP6g/qD+oP6W/pb+jf6B /nT+dv6A/nb+dv6A/o/+jf6N/qD+jf6g/pT+lP6K/nf+av52/oD+gP6N/pb+iv6l/qD+lv6P/oD+ ff52/nT+dP6A/oD+j/6U/qD+ov6N/qD+jf6K/o3+gP53/n3+iv6K/pb+lv6i/qL+ov6W/pT+iv6B /oD+ff6A/oD+jf6U/pb+oP6g/pn+oP6g/o3+iv6A/oD+iv53/oD+gP6D/qD+mf6i/pb+ov6U/o3+ d/6A/or+jf6N/g=="
var snd = new Audio("data:audio/wav;base64," + base64string);

var nullload = true;

if (localStorage.getItem('pander_notify_timers') === null) {
    storedTimers = [];
}else{
    var storedTimers = JSON.parse(localStorage['pander_notify_timers']);
    nullload = false; 

    for (var i =0; i < storedTimers.length; i++){
        var NewHit = new Timer(storedTimers[i].name, storedTimers[i].url);
        Timers.push(NewHit);

    }
    loadthing();

}

function Timer(name, url){
    var self = this;
    this.name = name;
    this.url = url;
}

Timer.prototype.start = function(id){
    var i = 0;
    var url = this.url;
    //timeintervals[id] = setInterval(function() {
    console.log("Started " + id);
    i++;
    $.get(url, function(data)
          {
              var src = $(data);
              var pR = src.find('td[class="error_title"]:contains("You have exceeded the maximum allowed page request rate for this website.")');
              if (pR.length !== 0)
              {
                  console.log("Refresh rate");
              }else{
                  var aBh = $(data);

                  aBh3 = aBh.find('span[id="alertboxHeader"]:contains("There are no more available HITs in this group. See more HITs available to you below")');
                  if (aBh3.length !== 0)
                  {
                  }else{
                      aBh2 = aBh.find('span[class="requesterIdentity"]').length
                      //alert(aBh2);
                      StopIt(id);
                      if(aBh2 > 0){
                          snd.play();
                          $('#HitChckBx'+ id).prop( "checked", false );
                      }

                      console.log(aBh2);
                      var dt = new Date();
                      var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
                      $( '#TimerLog' + id ).html(aBh2 + " Hits. Last Check: " +time);
                  }
              }


          });
    // }, 500);
};

Timer.prototype.stop = function(id){ 
    //clearInterval(timeintervals[id]);
    console.log("Stopped " + id);
};


$('body').empty();

var div2 = document.createElement('div');

var p1 = document.createElement("p");
var p1txt = document.createTextNode("Enter search term the box");
p1.appendChild(p1txt);
div2.appendChild(p1);

var textarea2 = document.createElement('textarea');
var textarea3 = document.createElement('textarea');

div2.style.position = 'fixed';
div2.style.width = '300px';
div2.style.height = '200px';
div2.style.left = '50%';
div2.style.right = '50%';
div2.style.margin = '-250px 0px 0px -250px';
div2.style.top = '300px';
div2.style.padding = '5px';
div2.style.border = '2px';
div2.style.backgroundColor = '#7fb4cf';
div2.style.color = 'white';
div2.style.zIndex = '100';
div2.setAttribute('id','Maindiv');

textarea2.style.padding = '2px';
textarea2.style.width = '300px';
textarea2.style.height = '20px';
textarea2.title = 'Input1 text';
textarea2.setAttribute('id','Maintxt');

textarea3.style.padding = '2px';
textarea3.style.width = '300px';
textarea3.style.height = '20px';
textarea3.title = 'Input2 text';
textarea3.setAttribute('id','Maintxt2');

div2.style.fontSize = '12px';
div2.appendChild(textarea2);

//Need this for a future addon
//div2.appendChild(textarea3);

var p2 = document.createElement("p");
var p2txt = document.createTextNode("-----------------------------------------");
p2.appendChild(p2txt);

var customBox = document.createElement('input');
customBox.type = 'checkbox'
customBox.setAttribute('id','customBox');
customBox.text = 'Use custom URL';

//Need this for a future addon
//div2.appendChild(customBox);
div2.appendChild(p2);



var save_button2 = document.createElement('button');
var cancel_button2 = document.createElement('button');

save_button2.textContent = 'OK';
save_button2.setAttribute('id', 'Main_save');
save_button2.style.height = '20px';
save_button2.style.width = '60px';

save_button2.style.paddingLeft = '3px';
save_button2.style.paddingRight = '3px';
save_button2.style.backgroundColor = 'white';


cancel_button2.textContent = 'Cancel';
cancel_button2.setAttribute('id', 'Main_cancel');
cancel_button2.style.height = '20px';
cancel_button2.style.width = '60px';

cancel_button2.style.paddingLeft = '3px';
cancel_button2.style.paddingRight = '3px';
cancel_button2.style.backgroundColor = 'white';


div2.appendChild(save_button2);
div2.appendChild(cancel_button2);

document.body.insertBefore(div2, document.body.firstChild);
$("#Maindiv").hide();

function Main_save() {

    //Future addon stuffs
    //if( $('#customBox').is(":checked")){
    //    var a = $('#Maintxt').val();
    //    var b = $('#Maintxt2').val();
    //}else{
        var a = $('#Maintxt').val();
        var b = "https://www.mturk.com/mturk/searchbar?selectedSearchType=hitgroups&searchWords="+a+"&minReward=0.00&x=0&y=0";
    //}
 
    var NewHit = new Timer(a,b);
    Timers.push(NewHit);
    StopSeq();
    loadthing();

    for (var i =0; i < Timers.length; i++){
       // $('#HitChckBx'+ i').checked = true;
        $('#HitChckBx' + i).prop('checked', true);
    }
    $('#Maintxt').val("");
    $('#Maintxt2').val("");
    $("#Maindiv").hide();
}
save_button2.addEventListener("click", function(){ Main_save(); }, false);
cancel_button2.addEventListener("click", function(){ 

    $("#Maindiv").hide(); 
}, false);




loadthing();
$('input[id="customBox"]').after("<label for='customBox'>Use custom URL</label>");

$(document).on('click', '#AddBtn', function(e) {
    $("#Maindiv").show(); 
    $("#Maintxt").focus();
});

$(document).on('click', '#SAllBtn', function(e) {
    StopSeq();
});

$(document).on('click', '#AllBtn', function(e) {
    StartSeq();
});

$(document).on('click', "[id^=StartBtn]", function(e) {
    var eid = e.target.id.substring(8);
    if(playtimer){   
        StopIt(eid);
        playtimer = false;
    }else{
        StartIt(eid);
        playtimer = true;
    }
});


$(document).on('click', "[id^=DelBtn]", function(e) {
    var eid = e.target.id.substring(6);
    Timers.splice(eid,1);
    StopAll();
    loadthing();
});

$(window).unload(function() {
    localStorage["pander_notify_timers"] = JSON.stringify(Timers);
});


function loadthing(){
    if( $('#tabe').length )        
    {
        var content = '<table id="tabe" width="760" align="center" cellspacing="0" cellpadding="0"><tbody><tr><td width="10" bgcolor="#7fb4cf" style="padding-left: 10px;"><img src="http://i.imgur.com/kmBEbFN.png" width="20" height="20" class="SettBtn" id="SettBtn" type="button"></img></td><td id="Ptitle" bgcolor="#7fb4cf" class="white_text_14_bold">PANDER</td><td bgcolor="#7fb4cf"><img  width="20" height="20" src="http://i.imgur.com/P6yjtwK.png></img></td>';
        content += '<td bgcolor="#7fb4cf"><img src="http://i.imgur.com/J3KyG10.png" width="20" height="20" class="ABtn" id="AddBtn" type="button"></img>';
        //content += '<td bgcolor="#7fb4cf"><button class="LBtn" id="LoadBtn" type="button">LOAD</button></td>';  --Removed Load Button
        content += '<img src="http://i.imgur.com/DbcQFTV.png" width="25" height="25" class="AllBtn" id="AllBtn" type="button"></img>';
        content += '<img src="http://i.imgur.com/ZFBJjUM.png" width="25" height="25" class="SAllBtn" id="SAllBtn" type="button"></img></td><tbody>';
        content += '</tr><tr><td width="100%"><table width="100%" class="metrics-table" ><tbody>';
        for (var i =0; i < Timers.length; i++){

            content +='<tr width="100%" class="odd"><td><input type="checkbox" id="HitChckBx'+ i +'" name="HitChckBx'+ i +'" value="HitChckBx'+ i +'"> </input></td>'
            content += '<td class="metrics-table-first-value">'+ Timers[i].name +'</td>';
            content +='<td><img src="http://i.imgur.com/G44S4bK.png" width="20" height="20" class="StartBtn'+ i +'" id="StartBtn'+ i +'" type="button"></img>';
            //content +='<img src="http://i.imgur.com/p1DmQwZ.png" width="20" height="20" class="StopBtn'+ i +'" id="StopBtn'+ i +'" type="button"></img>';  --Removed Stop Button
            content +='<img src="http://i.imgur.com/nUlYYUg.png" width="20" height="20"class="DelBtn'+ i +'" id="DelBtn'+ i +'" type="button"></img></td>';
            content +='<td class="TimerStatus'+ i +'" id="TimerStatus'+ i +'" bgcolor="#FF0000"></td>';
            content +='<td class="TimerLog'+ i +'" id="TimerLog'+ i +'"></td>';
            content +='</tr>';

        }
        content += '</tbody></td></table><tr></td></tbody></table>';
        $('#tabe').replaceWith(content);

    }else{

        var content = '<table id="tabe" width="760" align="center" cellspacing="0" cellpadding="0"><tbody><tr><td width="10" bgcolor="#7fb4cf" style="padding-left: 10px;"><img src="http://i.imgur.com/kmBEbFN.png" width="20" height="20" class="SettBtn" id="SettBtn" type="button"></img></td><td id="Ptitle" bgcolor="#7fb4cf" class="white_text_14_bold">PANDER</td><td bgcolor="#7fb4cf"><img  width="20" height="20" src="http://i.imgur.com/P6yjtwK.png></img></td>';
        content += '<td bgcolor="#7fb4cf"><img src="http://i.imgur.com/J3KyG10.png" width="20" height="20" class="ABtn" id="AddBtn" type="button"></img>';
        //content += '<td bgcolor="#7fb4cf"><button class="LBtn" id="LoadBtn" type="button">LOAD</button></td>'; --Removed Load Button
        content += '<img src="http://i.imgur.com/DbcQFTV.png" width="25" height="25" class="AllBtn" id="AllBtn" type="button"></img>';
        content += '<img src="http://i.imgur.com/ZFBJjUM.png" width="25" height="25" class="SAllBtn" id="SAllBtn" type="button"></img></td><tbody>';
        content += '</tr><tr><td width="100%"><table width="100%" class="metrics-table" ><tbody>';
        for (var i =0; i < Timers.length; i++){

            content +='<tr width="100%" class="odd"><td><input type="checkbox" id="HitChckBx'+ i +'" name="HitChckBx'+ i +'" value="HitChckBx'+ i +'"> </input></td>' 
            content += '<td class="metrics-table-first-value">'+ Timers[i].name +'</td>';
            content +='<td><img src="http://i.imgur.com/G44S4bK.png" width="20" height="20" class="StartBtn'+ i +'" id="StartBtn'+ i +'" type="button"></img>';
            //content +='<img src="http://i.imgur.com/p1DmQwZ.png" width="20" height="20" class="StopBtn'+ i +'" id="StopBtn'+ i +'" type="button"></img>'; --Removed Stop Button
            content +='<img src="http://i.imgur.com/nUlYYUg.png" width="20" height="20"class="DelBtn'+ i +'" id="DelBtn'+ i +'" type="button"></img></td>';
            content +='<td class="TimerStatus'+ i +'" id="TimerStatus'+ i +'" bgcolor="#FF0000"></td>';
            content +='<td class="TimerLog'+ i +'" id="TimerLog'+ i +'"></td>';
            content +='</tr>';

        }
        content += '</tbody></td></table><tr></td></tbody></table>';
        $('body').append(content);
    }

}

function StartIt(id){
    Timers[id].start(id);
    $('#TimerStatus' + id ).css('background-color','green');        
    $('#StartBtn' + id ).attr("src","http://i.imgur.com/p1DmQwZ.png");
}

function StopIt(id){
    Timers[id].stop(id);
    $('#TimerStatus' + id ).css('background-color','red');
    $('#StartBtn' + id ).attr("src","http://i.imgur.com/G44S4bK.png");
}

function StopAll(){
    for (var i =0; i < Timers.length; i++){
        Timers[i].stop(i);
        $('#TimerStatus' + i ).css('background-color','red'); 
        playtimer = false;
        $('#StartBtn' + i ).attr("src","http://i.imgur.com/G44S4bK.png");
    }
}

function StartSeq(){
    var seqi = 0;
    ChkBxs("disable");
    seqinterval =  setInterval(function() {
        //$('#Ptitle').html(seqi);
        if( $('#HitChckBx'+ seqi).is(":checked")){
            StartIt(seqi);
        }
        console.log("At: " + seqi);
        seqi++;
        if (seqi > (Timers.length -1)){
            seqi = 0;
        }
    }, 500);
}
function StopSeq()
{    
    StopAll();
    clearInterval(seqinterval);
    ChkBxs("enable");

}

function ChkBxs(status)
{
    for (var i =0; i < Timers.length; i++){
        $('#HitChckBx'+ i).attr(status, true);
    }

}


