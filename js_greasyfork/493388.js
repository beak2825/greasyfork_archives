 
// ==UserScript==
// @name         Matthews Shell shockers Theme 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Simple SS Theme using CSS Variables
// @author       You
// @match        https://shellshock.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493388/Matthews%20Shell%20shockers%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/493388/Matthews%20Shell%20shockers%20Theme.meta.js
// ==/UserScript==

(function () {
    const addScript = () => {
        document.head.innerHTML += `<style>
* {
	--ss-transparent: #00000000;
	--ss-black: #000;
	--ss-white: #FFFFFF; /*White Text*/
	--ss-offwhite: #FFF3E4;
	--ss-yellow0:#F7FFC1;
	--ss-yellow: #FAF179;
	--ss-yolk0: #f1c59a;
	--ss-yolk: #F79520; /*Yellow Buttons*/
	--ss-yolk2: #d97611;
	--ss-red0: #e29092;
	--ss-red: #d15354;
	--ss-red2: #801919;
	--ss-red-bright: #EF3C39;
	--ss-pink: #EC008C;
	--ss-pink1: #b9006e;
	--ss-pink-light: #ff3aaf;
	--ss-brown: #924e0c;
	--ss-blue00: #abe3f6;
	--ss-blue0: #c8edf8;
	--ss-blue1: #95E2FE;
	--ss-blue2: #5EBBD9;
	--ss-blue3: #0B93BD; /*Lighter Box Borders*/
	--ss-blue4: #0E7697; /*Blue Subtitles, Darker Box Borders*/
	--ss-blue5: #0a5771;
	--ss-green0: #87ddbb;
	--ss-green1: #3ebe8d;
	--ss-green2: #2a7256;
	--ss-orange1: #F79520;
	--ss-vip-gold: linear-gradient(to right, #D1A943, #CFCDAF, #CC8630, #D1AA44, #CC8630);
	--ss-clear: rgba(255, 255, 255, 0);
	--ss-blue2clear: rgba(94, 186, 217, 0);
	--ss-shadow: rgba(0,0,0,0.4);
	--ss-blueshadow: #0a577187;
	--ss-darkoverlay: rgba(0, 0, 0, 0.8);
	--ss-darkoverlay2: rgba(0, 0, 0, 0.2);
	--ss-lightoverlay:("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEhUTExMVFhUXGBcaFxgYFxcXGBgXFhUXFxcYFRcYHSggGholHRUXITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGxAQGi0mICUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALcBEwMBIgACEQEDEQH/xAAaAAACAwEBAAAAAAAAAAAAAAADBAACBQEG/8QAMxAAAQMDAwIEBgEFAAMBAAAAAQACEQMEITFBURJhBXGBkRMiobHR8MEUMkLh8QYVciP/xAAaAQADAQEBAQAAAAAAAAAAAAACAwQBBQAG/8QAJREAAgICAgICAgMBAAAAAAAAAAECEQMhEjEEQSJRE2EycYEU/9oADAMBAAIRAxEAPwDte46zMaA+6zL9590Rl4HfK390EfQJfxArnHw0MdS2gdHLj5BEfqpZU8E7ovw8LTJOpAAN0a3B1Q6hhWtakytTMlbVhXlBcuvd7qN0XrMSovbtRHoFF3zd/sEckLQZLYMtXHNXXuQ3uWo1WJ3RjRIvqStGs3Cya7SCnRL8NMWqVCCufGhVqukIBnstL4wTQ/Srp2k4FYbQ5NWtWNVnIXkw60arwFheJCOpwE/haQuB3Wf4oCQQNTtGyNOz3jxcZ7Mi5eSICWAjB1RTXLNhx39UCu6T1cp0bOzCLWvQzTcAMIZ4KHTecBXu2lpg78IpHlHdAHuAKlMyqdOUxa0pXoodQzaNhydrs/fRCt6O/CZpDrcBG5yfJVw6oGTS2DtLZ7nYBC9H4d4TBBdnsmPDLCMjXla7KPSrIY0uyHLnYI0+kdIEKWtEB0krtUnlEsKRI7ppz8rdDfUEdzgN9NFSlbkGTH5Slw4uKNbOVlSRpi/81FnBxURcUSWxP4QZ1EazPlK7UZ1AHYpi2f1Oc0jIJ9imqNuA0t4+xXxSLHKuwAoQ2fJWNMADzVXuJpxOWn8pOn1F8HQRHBBWgKF3srftSlrW1HqtG4AdMarLiPT9KwfGKcKGpUa5VkRKE+sdBusQvjZ11WajQCca/wDzGnvCccVnAdO/mU0EaPTitUWe5Ue8BCe5CIRmxgXfVWX4lUjRaCyfEtCiiV+PFcjO+Mq1H+oSz3KraibR2FjGviRjZGpvaky/CjHrFExwtGtTIlSq8gHLRzOfYBJf1WIQKtXhEkKjhbYveBoyCDImB57pN9YLlw9LlUR1E6mPHrYzbPyU22oTgZKRtwtS2b06pkYXtnnjti1xQggrT8GsiWl8azHpulr5wdUHSIB29YheotafSxoGgbj1/lMxxTk2bLRnU7IBvzcf7XTcgQGt9U1BMgjH3VKNqHOEAgTntgp/6RNOWzR8Ou3HZb1Kr1NzqsiizpgYC0aQxKoi2IyQUkVrvG+O+ytQuAN1SvVDcbpVwMYz27lbyonnhTWzUfdg8IDaudMIVCjjkp2lRxKdB2cTyoKLChvZdV2NELiYc/8A0z/6pgg/5c9wn21OoSPXyXnOktPIWjb3Eey+JcWuzoygq0Vqg9XqtF1MANI352JGnklq4B6XD1xwiAh7SAYnTsf+rwL3RSralpDgMH+4fhKeKUOmHjQrTs6joh40xPCpdsBaW/4u32B58l4KM2pbMYPBCXODK7HRgqld0heHcaeugVR5ceyfZUkLNlM29WURuSGgzhlVlSoULqWgJWFecLIv36haNR2FiXzyjiVeNC5GTWOUFwR67N0qCnI7cNoIwo/SlQ5NUThaemirxnhFqNxIVKje64JQv7PRarZn3DDolyFpVGZSt0zROhK9FOOfoJbswtBo6zHbHpJSdIT7BPCnEQ6PxKrWkbKYKhQIqyRgHb6fVe5ZQLGjfGdZb6ea81/49Xa6s4kQ3JEaggE+a2RdO6vlc8fK0wYjfDiN8T5o8VJAyY4aYJ+ZoHGcjuT768qtvQAdj7+372UcTl8H5gZEaGc/dHsKYDCSIjPoNPp90/VkcvthOidtwB7p2rABAOQP+rPoSS7jEBcNwQOkRG55jZFyoBukUrUpcHOM8Duj2dJzjO37oiW9qdeefwtOi0NHdHCLZF5OZKPYNtIiIBMpyjSMQhipomqf/VRVHCy5uboB8MKLSDRwovcib8f7PI1qM7KlJu4TlR4SwJ1Xzs8cbsrjJ0d6iCCqV6m7fX8o/RPYpZ1F0qOeJp6DhNeyVr4kR1Z+44KYtfEIADkk6h7oXw3aLHjaHfCSoY8SptPzNPmEk5uxxxwm6dPERnYhcFIzkSESxNaZ5TSVGfXah0jBWubYRjIKWfY8Jj8eXoOOaNUwBqbLhcu/05ByqmnnMpXBoL4+iOyEje24IkLVpUJQbu33CrxYXVh48iUtHl3FLVqadu6BDv3lKvCCqO1jftCyNRPdVe1WjErR1ljKs2dkXBiFVrcxosaA/YGqxAfQJTYA9kYgLy0GpU9C1vRg5KdZrEeu6tRYJKZqOyMZ3hVQla2LnllyF/DbaawgxPJjOZW3ZFmhwNJ3g7rKL/h1GOnQ5GshwiM6f7Vw/wCcDVpmMga5GvpnsnxaQxNtbNok5E4MidRI0TAGrRuIO8Zk/aEoyi5sOMmHa+WsjnVadxTJMtEZH0Gp9SnLZksdbK0yACYiABO52Jhdaz5uw/BVarZbH7hFsmTrqIgdkSZNk2hlvUGhCdUMp4U9eASEgTDjCoiyHLijPUgtK5M5WtbVsLLDAc6Jim/pGU5bRxfKxKD+JssfhRY5vyosoSr+jNqYUaite12EP4XdcBwvodfpjlBw3XarUo2Uz1kjIR+qFtUwbqaBUoT2Kb+IIQKlVY4qthxv0Aa+Dyriq0nX31QpVukRkJLk+hjSGWPE591eqI105So7IgrgCCq8ORJ/LoW4hG0g7SCOVx1CNlylVAMA47kyuvcVQ1B/xM2mIV3kHGEjc11qvpk7JC+tJCXWyvDKN7Mq7AInkQsurR1WtXoYjurMspbptAScmNyejp48qguzzj2RKowzhM3dMtJBSrVK1WjoxdqxikYOUZzcz+5QHnAXW3PS3p1/hZRq2ilYycLtJ0ruClyV5IJP0Mtqkb6pyg+QCSsiU4MMCbFGyjY/XYDIO+nplDtmS1u8T3xOyo+tLGmZzB9srjawFMj/ACke2sgecKhDIRpHoPDLx3V04MnOJ0jf1AW9fV3U2ta0ZJAJIkkAT7T/AAvI+F3LmguPzRiJiCRAz6BFvb9xLXaEADtHp6lNUqQcto9JRIdI3GeyjIBjMjQ6b6JPwa6DnEb88rRNOTI2TIdHNncWMtq4PEYSDnfMUw+5bHTmYSNfcp9irjLo0KK7dIFtVwE4ajSMpqlohyeLylyYj8UcLqu5+dPoot5A/wDOvoDVtIMBMstiACmIzBCpV7FcuGGKbaOW5t6F21M5wmGzOEk6AUxRuAmxxv2HwvojqEperT4T76oiQlK9UAaJOTHFGpNMU6juufEhEdXaRwutzqkKKerGf2gbKpBwERzy7YKNIlcqNM/LojUNdmabIKZ5XIjYkrrXHdQO7lNjiR7YWm6NVWq8RPZBfVHKzru9AwE5RUew8eJyYs53znuum76Y5SQuT1aBUuLsOKS5WzprC26aKeLCYcd1lRGi1HS9hnb+FnuZiEjNH5X9l2F0uP0XB+RLuHOyKxwiDqNPVL1Hyk0Pgg1q8aK9SjiRtt+EkNUyakN81jQytgAU50zT8kjCbquwBwE6AVHWbDnKZfSzlu843x9kvaCXNC2qjZMDQDy07+ifFWhyiI29QtkEajWTiMicq9Il2m+spu2awlwIzGvGhx6hOmk2MQM50H7otUbAnEP4HT6d8z/z+FvU25O3+8rJshDZgYB03jKLb+NUw2XiXDEbHuVRBKJzcqV7YxeWsnr4+uErUfMhalvfNqbj0SV3ax1EaJtk7ST0VtT8sK5KXYYVxwtsdF6LuPdRAfVgwotPcDerrPr1CE/Vek6zpCLHDZ83jhsyq1wRlCZcZV7qjMwuULMlocQYn6crMnejs4fHUkMMuYwuPqdWqzXkk/spn4mVLKN6AyePxGRREhaTA0BZrH6FN/FS4YknpEGWLBVWScYCgjuu1qgQK1VOhhrYKTZ2pdQl3V90uXSURrVkm7ooUEhOvcFZdWtlaFyFlVjnySJNo6OCKB3FYgRuUC3OROipVdJKG50JCe7OhGGqNqk6D2Mg9pCXriAfRBovJartGJ9P33TptNCVjaYnUcgPci1xnC5SpZlSPWyyKIKfKvc4jyV3GSl76pJA4WR2w0rC0BKZrUYPmJXPCiJg6EJ19PqcfQJmOD5GrsH4da/M3vE+phaniWnEmengbT9PqtG1sg0CoB8oBLp5Y04HmvP/ABOsidSSTtqq64qhw5Y0ZcCMSBj0Oc+q7c3hB+VsdIPfGRod0drjTYameoDG2qxqtV39x5Ok7/v0WXRkkqG//ZugiSZ129ISj3mTwlHPcT2GgTgIIGxXuVnNzRqVmlZ3PREGTn9lejt70Pae49vNeOFFx0ctW2e2i2HdTtyWjzxmBunQkxEYRb7Ncjb2KlJ4WV/7YAxnny9tEWlXnRMUhjgqHHvErqSc3O6iKzLR6SqcYST6uUerUgeazK9YzKoyJLo5WHCmGdTDpjE5TVZrWs6QdgCfL/aRMxjVWeQabgdQB9Bt30UsjrePDjoQvLYsncQMjGDv9Up/UR0u2z7pmrUdEZjHnxgpS3o4c07g65gjSY21SmHlgmP06yO2vKxresSIPH1R2VxGq1SOXlwbNB7kvcVMILriUC6rpkct6AjhdjNHVMhJWj02H4KxxtgzjszLyrCQqa+aNdPyk61XVTz7OhihSFbt4nASxKu/Vc6FNJ7OhFJIZszjOn5Wl8BxpmBmeYxGoWRRdqCmmXzmghoEHn+EUJqqYLjsE20c5xAz5JqpbdDc/wBx24HKUp3zm4bA8vyjVLjq5J0ygcUx3FitWUu5q1emQlLgALPSCTL2RyvQ+D2hJLzoBPssXwqh1OhekuqhbT6WmAIB9d5VONasZFGTd31SoegAkcD2yjUOhuZmOBOmv/Vl1aoJ6Wf27nnuTx+Uz8Y9DmidBHluey9yNO3/AIiHyAIbgAbgDlIGprJMcBD+KQI+4SznJbkwWNte3hM06gIhZrSm6J7LYtiZws0KVE4ymXNdG+Y17I9pSGDqYHqnWP0LtMHScKqK0TSwu9GQ21MzH+wm7UEO74+i2K1vTiQMYiJzjAHf21Sr6XTEZJGT6gLaCWNoK1pUQwDwVEVm/jHqzyIJKUpZOdzPsuOJJj2RadLp0zGp/e6oyyuWiLFjcXs5UfnEySBnaeFas0twAf7o9J4+qtTb8xc7PHoFS7eH1BjE/fKneylFGsLJBAj+DOQknvIcSwGYjy2jTcQtD4RcCNOk/KeZOQZ3S9KgKQc57Ww0kmCSAS0NOvshkh0FZ5mjcfMQddfRGFQCYyEJ9L53kGT/AI8eRnsUvVrGFMv2bLEmSrfOHC6bkmFn3Dseq7Rq4W8qZ6WFVaR6Sxq6J0nCwrCrhbYdgK7G042cvNiakZt2yMrJquyti/qbLHqNXO8idSpFmBUtgiVdrpQyFWFK2VUmGIXXBcpiU3St15SoDko9ivw0ajSKa/p0MuToNMdCal0WqVBCRq5TTGzrohvZJW8bdhKJqf8AjNAkl3+IEH8eaf8AHWEu6f7W7DTPfnUKnhTCxgPVDRk/gfRc8SqCA6QcaTmTrPuqFqI1dGE6nkg4g5/CpSqFpmR+UStTkyMBD+UbSlGA3U8Ez9/YIDGo9Umf4UaOVjQLKtpJq2p5lUYEzT7BFFGNDVrU6YLs8Z/cLZo30/2tGmhErztR+yf8Pef37J8X6F2b/hL5EVCZBiORsR9lousj1SQAIwNcBZ1nJPVx99l6GflnnHqmJG3oRZbEiYUTzHABRGDZ5ihJycZTlerDSBvrAQm8BUrO905ombTdhBUET6JendwYP6EtXuQ0a5ykqNcYkZ2U83syjbFRp1JjYGMDTTnSPJJeNV//AM+k5A94BVKLfmlJeP14YG6lxPpG6Cb+JRjRhWlZwLjJV6o+We6PZBopmdZxxmPwUjdVJMAyp46Wx+lsTuXZVGrlU5VmBLW5B+jX8Pctpz/lWJY09Bytmm3EJ6nSolzKNGVcuKASn72kAkS1Q5HsTFpi7woAmSxVNJLsPmi1q3K27eiIWPRblblsMIWR+S36B3FLCz3UVp1gkK1VU4o/ZT4kXWwLxGAuimBE7f8AVVjZKq5vzAHRUUdEbta5c7OG/wAKnirwD8sx3ReoNBj/AIq1LfqaJIGcesQTGyJrVGmZTqCcq9WIkayq17Xp1I9NfZLhxS7rswICFGyusf5KzRlDZjRYIzap00G8b+a4ylKbo2pJEIkY+i1nRnUT5rQo2hluMSP0p238MM+WB/KcqscPJOigEiG7a1oAweN/VadqJYXE4AGvP6VhtoE6T5nRalpbdDck/TVNTZjpjdIPgfgKKBg4URGGRSA1+i7cUQ7KjWHVBrViNFWzmJO7Rm3dslQ9jdMlWvbvWEpTpwJUsqvRVFOtjDrkyNhlY3iNYveewgJt75krOuGmVNltobFpEpVZETCsaWJGnKU6JRmT0ls44Uzb6Cn/AGLuaJJ1RaYAyqPpIttRDgZwvXRraqzUsbnqhsgbjAgfsrVYdcyOcQvNtbBEE8L0do3EEBJlN+iDyXx2gNUzqEpVYDstg0RwkLikZSG2yfHlTYk6kRjVXbTVi08qwaV6I/lZWnRytOjgIDKaI0FOhG2ClzZ2o5Z11T3Wg9hKTqMM9lfGKo6eKPFC1A6qFuc6qzqJB9UZlPIPef8Aq9Q2Ls1LLwrry8wDB7xjRGv/AA1gMMOQMHXvBS776O5xrv6cLj7hzfnJ11H4TaVBWYV1bmTPOUJ9DC3KDg90R+J7pG8yY4xj+EiUUbRlotIpp1t5KUqYEIOLR6hm1o7nYfdb/htp807D+Ak/DKYc7OkfeFv2v9uBEn+U2KPUHp08z68INwnajInmEEMBIkd05C5EtKOkpk0ZM8IzG/vmiM0PqnRRNOVAOnsuogCiKhP5TzFzXDBGVhXN252BhdURZW7oHAqRmNBklPUmyP393UUSYIblk6BlqWr0QuqLXFUTKTsT6YXG08qKKGSVlN6srVQD2UUSmNj0aDKGAD2051Wz4a+e+yiinZz87uDs0mu7IVSnKiiE5sexSpRQ/hKKLSxPQWiyFd+FFEzF2OwbkSjUVa1MSoougujrpaI2gCOSEvXd0A99N8DCii8EuwFGrLpKvcViQoovX8Q4oT+K4NOYlFsxuVFEldmMcrUNwlgcxyV1RFI8j0FgyHARt9RMey2QyGT3CiiOITC1XQFwaj0+qiiNC2Oh+UN1TEKKKiJLNAzWXFFEYnij/9k=") /*Main Background*/
	--ss-lightbackground: linear-gradient(var(--ss-blue1), var(--ss-blue2));
	--ss-blueblend1: linear-gradient(#349ec1, #5fbad8); /*Some Box fill colors*/
	--ss-scrollmask1: linear-gradient(var(--ss-blue2clear), var(--ss-blue2));
	--ss-scrollmask2: linear-gradient(rgba(56, 158, 192, 0), #389EC0);
	--ss-fieldbg: linear-gradient(#91CADB, #ffffff, #ffffff, #ffffff, #ffffff);
	--ss-white-60: rgba(255,255,255,.6);
	--ss-white-90: rgba(255,255,255,.9);

	--ss-me-player-bg: rgba(247,149,32,.8);
	--ss-them-blue-bg: rgba(0,66,87,.8);
	--ss-them-blue-color: #5ebbd9;
	--ss-them-red-bg:  rgb(133,0,0,.8);
	--ss-them-red-color: #ff4145
	--ss-me-red-bg: rgba(255,65,69,.8);
	--ss-me-blue-bg: rgb(94,187,217,.8);
}
</style>`
    }
    document.body ? addScript() : document.addEventListener("DOMContentLoaded", e => addScript());
})();

    // Your code here...