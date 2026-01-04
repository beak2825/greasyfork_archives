// ==UserScript==
// @name         Koanami v.9.1
// @version      1
// @description  türk mod GG yapımcısı enes duman  TrueEnes:+2
// @author       jrokTR
// @match        *://moomoo.io/*
// @match        *://*.moomoo.io/*
// @grant        none
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADgCAMAAAAt85rTAAABv1BMVEUJAB4AAAAj6P8IABwAABNkMsIJABwGABoAAA8AABEAAA0AAAplL8KSMP9iNcJjM8IcqcJdPcIAABYIABYIABUj6/+ONv+JPv8sjsIAAAWGQ/+ATf+DSP87v/9Pn/9Ul/9lef9PVcJqdP88dMJVlP9fhP99Uf8mmMIqksI5w/8JACE3fMI6eMI+ccJRmv9YkP9ai/92X/9YRcKKLfIn4P8hoMIyz/8uisJBtv9dhv9PVMJqcf9xZf8g0Ogp3P8u1f80gcJJqf9JXcJVTMOCKuYUa4QWfpcdsssk9P8LIzkjnsMx0P83is8bNF9Jsv9Jp/86V6o1SZZRcd50Y/9OPK0SCDFtRN4iD0xBI4Y2Gm54Ped0LNQQAylZHqJlILUsDVZJFocOQlUVbokNMkkQUmYVe40LFTQNL0cfxNwXi6UMGz4KFiwZmbAPNFIhrs0chKQZb48WWHgnqdEQK0gYSGovptohYY4wkMkgVYIqcqg4o+UeRHMoZJkcO2k+k98VHUokRn4vVplBgdYeKl5Ke9wpOHlIbMwySY4ZGkkkKGQ/TqY3QJFYbOMtMXYXDj87OZJiV+BDMpNPNqo9GXY0D2MNX0SBAAARH0lEQVR4nO2diVvTSBvAO6R00oSjTYtYTg/AJa5yeVRAXbCAB4cKJT3Sph6LiKLiLbqggCyghEL5g793JkkpqN+zq5Ru8uTn87RpaO388r7zzmRSisNhY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2Njc2C4fH43FwjwHOsqdFP2G1DjeP+jO/fv9/X3373b98hShphFjnv3+/586Cm6WlF0cXLgcf81XOhG7RuYQxN9noHJi0UVFdTO87jvzoRVAujj0FTfY+pWUQR6Ax7Qe+DyWcPP5ePu3Z+8ehXcKETP0z/B+wrdsH3CJ977c/KqLgdMgt7DO5xVOp8fPfBMFhl6FUXQ9zwDfY+sozc9cDGrV1RBsnPg4R2HRfx8+M5AtucZ2fl4Glml87GP+i/m2OnF5YW70O3aL7j7A0U5fhUXPaS6XPMXul37hAvNTJJR7+JFI36gN9B/zSrpiR19pPddfNif0/08/cgi1cXhv/YY0nPgzylPRbZ6eh7fsUz3878Av4H+R/JkRTY9wc8q4YO5y8Wiq55HrGOgYqe8DExbpftB/3t8teihz30tN36ePlTodu0XLvFhxeR90T8xkNP/PHcd1jhzAPi+ooE7yIU8RTnxu2udM1v2ftFj0e9A/bn9r88qs0/ogOLAQx92uO5rsxgtfg9Fy/i5eM9j5HL4HugFhvY/zwPLFFCHo98zAfFz9J8hemcmtQ5Y6EbtH/57fWS2ie6fySkwD61TYFzXZh7A2YJ7uuIMYdJz1nP2ydl7VjmBgCnMNJHBE0+KqN+Ts8CTu9bxg9ARGdRP43eJ+p196rLMCO/wvaS3156cuXTp0hnNz0oJ6hBFcuu/e4mi+T0TrRHAR9kt//QT6qcF8PpLSwyB6Kmcs33m8uVLl59cpzyzhJ//2Uy2o/kmLlOeU78TljgJ9L98nj3Xc/FPLhG/Jyeo4NNAIRu2T7jEpy93AvjsBvG7cf0EcP3EjBVWYbiZE9m5GJ54DnY3Lj8/QXnKFrRl+4Pr0fWn2Qf8zLkbwDnN78QMX8CG7RfszPNpI0N9D57fOAfoATzxwgIlhhGfn8hWEm7mMvEzAvjMCh8x8L+8sZOI6Dfq9+o3jRkrzNLQb81TRiIyiPo164KHrZChUFVeZQdBXgtgsxFACwyCvhevzr3UxzoXO9VMMQL40gIZip9lA+hyTb3WBA/rWCBDXROHz53XBDE63KwH0BCUmQI379fxTdc2v6Y11D/xqnmP4DsLTGPQu+ZaOsr7XhyurQW5Wrh9dR7szh9+894CXRDVNh+egER0Od7VZpk9T3kTNv9ioX+oufY1RzZeEDMtgobhGwtcLkPnm2dJqXShWfA6/35o6HxOCK0gOFv7jmhwb5uDtW+Q7+Xr17NB4A3xe2d+Qf9QMEhqKCNCAGcnps4Ha4M7gh/Mf6rkPh8MvndCCR2aDda+RjQ9iV9w9g/grelHCTz1JjhLJtrc22DwHfoj+E5EH4LDhuB7069W+KZng7OkhgbeBYffTg1/QNj3YnZ4dlgT/Mv0wyD7djj4ASoJMzEYHB76MEzGPeZdcHAuOGcNQf+HYPAvN5nFzAVn5T8GtXo6PPjHHBUcMrsgnhgcDpKoud/3DM+hQdrnuLc9cycHBy0h6JvuGQ6SqPFvh4cH5Tk6J2U/DPec1DC9IPt+uGfYEJybmiOL9Ix40jqC6KQh+KGnRxeE7thjHcGenhzB+UEixP41DH1Qw+xVlJGHR0aG/S5SWEZGRoZOfgo4GPR7z8jc7xpmF/TN94yM9MxDXvr/mhsZ+fihLozQB1Bd0AU/mnwm4x8CwZFPZKB3/D4yMvexbuET3NeN/H5cFzT5XJT9OFJXVzcnwvm8e6iubmThY90I2VN3XOeTyVdFeSpYR0oLIx+n25QFQ/C4yc8HA5+oFMlRh09e+Ebw1CmTC6Ljms8Q6WrOqVOnySO4WTgFbhTzC54G6hamiKEPzS8sLNAdp3W/UyZfVUNUJ2sIiswnbVf9giZo8nECBOsppxeG6DUI92L96aVPn04tna7XBD+Ze6Tnl3TB+notVOjU6aUhP3JMLZ1u0HPUzNcmGGapvoFSv+QmIgzfUH8TT536e2IRdlHBeTNfXXLhpQZd8KN29WWxvuGj2z+1tDS/2NKwtLy8fHPRzDnKZAVbtOEg8Hf9EoTMudiytHizpQUEl/82c5WBFG2hNCxrguhmwzIZGLj5hlPhpRYaQlPnaEAXbLmpR/BWwxIVQjdbFz+3tJIQfjazIFpqaSUYguznhqVFJ2y4P7fcWtEEb5n5Gi9aat0l6AMp2unwxPLtcGvrbWJo5hxFy5pgqy7oQLDpIBHj/279fKtVy1GuoG38JaCrXSC0LhuCa63LE2T66V68sDYFIezt7V0zsWDgliZ44bYuyMMO2gl9i7fXphovEMHeVWdBG/krcJ8vNGogrZL45m9rsrABgo1UcI0xbZlh13XBC0ZHc9+6cCHszwp+JYK9K6YtM85VI4JGjuJwb2Ov6COCn+cNwS9CYZv58/hWdL/Gr8aZLbfa2LgmOv2ra/KaIbi2YtbTXiw3Nh7R+GKsnzGfG4/0rqApeRX2aoK9X0Sz9kJ0xKDXqTswaA3Evqx++UoFjwLQC816ToF6s4ZfsoMBWs/u/HpUx23SELI7Lr3ZNHQyNHrELyu4btKhwr+4E0F9LGDQ6tHOr0eOHTlyNJeVAxjt8f4fRDwPKoQjR8OaoNOxBm5019evnVm/zo28LyAyPjUPC0DODU3w2JpxPtGpPe7S7o597dTZyHclZTe61vd/+cC9rousawuj4NfVdayr8+ja0U64J6R1w9X8Ll44pa50HqZMvpWvVOOY9n/zG+RRej2MEAqvb6Q1xSuaoZzPJMXiWNeVPHQDvHKFOhzT/m9EHqVXWOwGQ8SvbKR3DK9s5PGL8BhhI929mYerkQzu1PKQVjAsk22VZ4R1MNtcXUGs/uMrhDx2Q7ye7k6r+ZjUu9c1AzqR4Ta6uru7oNyI6nonKKY3GaR2kn15NuRX27u7x/JzKQulQaA7LZCmozHYTpP3wSxavZLu7rqiImEsTZ6gGean0DhVeK/uPH2bC9qkgrSCoCvduiAkr1NehXdNryLnZnfWcB3lIYZsdCw9Otqep2uRPpU2X6WCYzuCoMiJJHbrCFHDdmoo7f90A0tj7W1to5v5+nQxIhbddOGF3yCbO0dSCEPXSK8jcbN7dJQato+t77chL42l29ra8lNiCNw6sdogxw+iCSLCjoFbJfarCI2Njo6m2wljG/vaVxiBxq+tbTNvk10cbofWXyFxYxAIjio5lQSr6dG29Aonto/CQaaG7Zvi/rUFo2g79UtL+VsXETZGjQyBSLW17ertThnevz3sDpNm6IZj0n7F0K1utrePE8GxPH4ih8HtRorwmyA4quZGiJXI26NAlDSj3TAM7EtHdKtbXi/1G89bDySw6yRuZKAQpFGikzueMzzRV1iRVAKvbril7MO0kWEk4tcEtOVpkDfgN+EYhkkncG+SwynlrtYL6jg5wkjRQ+gltI+pv/gtnNjNRr26X1NTns82MSbR4TH5SkMSL++uJOU22+AQC8gLd94dImH8861ifGGiZ/hF8/0bNtDRmto2yQjnhi3wcOQkqU/1NjWNRxF4No3nGEKe/mxPxDLJzqzfVh4WK/a+YTs0nowPjIN4tG3m9gkuQhrBS6Qt3ly2Mj+VpwwPxaXM6y3T/cbzOEQYsFHiwJIkRfRNcw2dErTEK4a9ewVBUUXOf+fIYJ7JaC+ONVVTtg5gUZLhaZTIJIaL0qOq7Jx9YhkEocxsNu3OUaDMG4mqWPinjgx2MlLEW0YY1/Wqy/Ixgf8GTOJDyycjblHDaPZ9GX5HMFamNa8sq1jmjSph7p/EEbOCqkS0l5ePVxscQIIShDCxIIuHWN6qbqpuim0Zf4oAM+PVTV4ZRcgxj8ViNIdj4+NlWdmtSJQ4/h9JBgtcOJPa0l5QNl5do1MdOaiPbLISaGyRqoHFCD203jCt3jBfbKqORQVhq3oPxNHAG1EkOcALGOOcVXCGgcdYYJEsKZCa5Xr4YjVZyvK6lrULjmiVOWih0Qyrowh6pQpi4wpyKnv0yOGvLt9RLC8uLo4oqhqWRUagYEaUw6oqKZmy4uLy8t162u24dHAXyJkACREdkxhHhAhUV0ckBkcjkajTyaAtYkSaFaMlXmtgdU4QAfAo20pFMlFKJhNJJah4uQbcF5fEqqqqamqKYzVwF8sc5C/RQrWsronRPoHFjNZLxsuidAURoS2yo7wM/BQmEMCqtKXlWKysPEvxXkp2PywvLyFewFaC3NZk9mfW/k9xquPQYomUT+yUSmoMg1QksjVOtyUQHCf9FAo+VkpIG6tixd+X26NKXA29qkyGxLEqIRzwRSs3Ndwmb8s4kQQPaHOoG7mPogjclWkrwPCMFP1xLB6riWkCGsb9HuJVOiWqFKuqrKxMMAd+bdwZhtSJRbWOL6iZbJuoSIQRoGVVNVuy/gTJ+FFcM4jpxL9jF6up1IhnRLGEbJQc0Ai421CNE0Pj61fUVEnWr0zhGIahfadEQpxTgBhXVcI/eAFRoEHRqNqrGI9lf1YiBVCKPkkpyG/pC2EStW19Fo2FsJJKQMqVJaIi/ZieTBsXK4lsQ/UvMRpN8q9yFzmK8XhoZ3dK5dgIfZw56A6o41ZjEJaEzOqKzgCi6DNijDKhPS5EML53V2VlaG/sYFcEBQScqKw8dCgePtgCmgP0Q9LmlBj4/iHmHJninIDFE/HKOPE7BImaTEC446FDlFAsRFQMQiUZB/n9xATZF1cK+Oki7IzEqKLEfrcV5O+7SZlUIpkEn4zsKDkUAqV4SpGU7e1tRZG2E/FDe4knMwyPYTaRIo9KpIJ+SwbDKTSxQnGV5KZTEPaeLDCC2+2QZVkU3NBpqYCkxjs6YKOyA16mJnfrhRRVJhewcCBBnywX+tNhvGTEIJ7IKIqy/Z2KzlDgRKtE8+voCJWkMplEPNTRIaFEVq4jlISZrHYB0pEixyAZLrQfOYtP7ApBkv1RScAyiVZCTWQkAQVYLoBkJRXP8GRv6aFQMrWtcvqE2ikmO0pLO1IFjx9BYFMluTm2/aNLgwxOHCotTYRFzqhJWEBKKpwpJS7bjoDTWFLipCTsi2fY/8Zn+xg+nIF8KtU49ONpIw7HodnhXZ98FuRAirwMObOvYpACzytNqgUbHr4BB8KJDl2wtEP54dVdbhueFZf4nIZjR4a8MrFzto4DqRAJn/BfSM8sOJCJGzGMu3+YWYgkaWg7wMIpLoAFXqZHJrRTmpxhEtEk+mFXLhAMJ6cMxdQPV78YRKITgnqrOljWoSraYQmlshc5BCVJHh/c8sQ/B2ajmZCWpAn0o/RiHGqCPANGCkIHTeyQpPsxAiJJnFB/Ya0/n2AOqYkQCUlS4r4NIt3DYIQycd0MTEPxlIr0siRgCF8oIaO8L9D/PBgJqTjJQuWbNV5G1leIGRYhNUPmb8nENkK8/kSGlxKhUDL8X/+TcJhTt1NxEog9q2B8cqdvMpgNoAAf4HcGB4xAL6X8y/X9goCdrAojWVxBueWUgxlaKoDY746SjMCKydKUJBTozO9fg+EcPpVMZSS9eGCBo4M31E9J5jm3IODcfsaISiaVcfNm0aPQipOiHxsSZVVJhYx5QDKVyiiSKgs8MjqgKCVUzoQfZ8e8qJJlt7CSSmYnOlrtDMU1Etvk2qgom/UvEWsXH8SwCme4cOKboKUzCWL0PgGhDNM/rGK+4O2GwVhwcjzaQ4BzmqrX2djY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjYmJL/AdQSZGcGm6YbAAAAAElFTkSuQmCC
// @namespace https://greasyfork.org/users/1294973
// @downloadURL https://update.greasyfork.org/scripts/504577/Koanami%20v91.user.js
// @updateURL https://update.greasyfork.org/scripts/504577/Koanami%20v91.meta.js
// ==/UserScript==

function onBoxMouseOver() {
    this.style.transform = 'scale(1.1)';
    this.style.borderRadius = '10px';
    this.style.boxShadow = '0 0 0 1px #0c3fcc';
}

function onBoxMouseLeave() {
    this.style.transform = 'scale(1)';
    this.style.borderRadius = '0';
    this.style.boxShadow = 'none';
}

function onEnterGameMouseOver() {
    const enterGameBox = document.getElementById('Enter Game.');
    enterGameBox.style.transform = 'scale(1.05)';
    enterGameBox.style.backgroundColor = 'rgba(11, 133, 189, 0.7)';
    enterGameBox.style.borderRadius = '20px';
    enterGameBox.style.transition = 'all 0.5s ease-in-out';
}

function onEnterGameMouseLeave() {
    const enterGameBox = document.getElementById('Enter Game.');
    enterGameBox.style.transform = 'scale(1)';
    enterGameBox.style.backgroundColor = '#89878a';
    enterGameBox.style.borderRadius = '0';
    enterGameBox.style.transition = 'all 0.5s ease-in-out';
}
let menuLink = document.querySelector('.menuLink');
let menuText = document.querySelector('.menuText');
let DeskTopInstructions = document.getElementById("desktopInstructions");

if(menuText) {
    menuText.textContent = `Short menu :`
}
let skinColorHolder = document.getElementById('skinColorHolder');

// Устанавливаем отступ вниз равным 10px
skinColorHolder.style.marginBottom = '15px';
if(DeskTopInstructions) {
    DeskTopInstructions.textContent = 'Function:'
}
if (menuLink) {
    menuLink.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
    menuLink.textContent = 'niQ';
}
const boxes = document.querySelectorAll('.menuCard');
boxes.forEach(box => {
    box.style.transition = 'transform 0.5s ease';
    box.addEventListener('mouseenter', onBoxMouseOver);
    box.addEventListener('mouseleave', onBoxMouseLeave);
});
let hideSelectors = [
    '.menuHeader',
]
for ( let i = 0; i < hideSelectors.length; i++ ) {
    $(hideSelectors[i]).hide();
}

const enterGameBox = document.getElementById('enterGame');
enterGameBox.addEventListener('mouseenter', onEnterGameMouseOver);
enterGameBox.addEventListener('mouseleave', onEnterGameMouseLeave);
$('.menuCard').css({'white-space': 'normal',
                    'text-align': 'center',
                    'background-color': 'rgba(0, 0, 0, 0.6)',
                    '-moz-box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                    '-webkit-box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                    'box-shadow': '0px 0px rgba(255, 255, 255, 0)',
                    '-webkit-border-radius': '0px',
                    '-moz-border-radius': '0px',
                    'border-radius': '0px',
                    'margin': '15px',
                    'margin-top': '15px',
                   });

let firstCheckbox = document.getElementById('nativeResolution');

let newCheckbox = document.createElement('input');
newCheckbox.setAttribute('type', 'checkbox');
newCheckbox.style.cursor = 'pointer';

let newLabel = document.createElement('label');
newLabel.textContent = ' Counter For Menu';
newLabel.style.fontSize = '18px';

let lineBreak1 = document.createElement('br');

let newContainer = document.createElement('div');
newContainer.classList.add('newCheckboxContainer');
newContainer.style.marginBottom = '10px';

newContainer.appendChild(newCheckbox);
newContainer.appendChild(newLabel);

firstCheckbox.parentNode.insertBefore(newContainer, firstCheckbox);

newCheckbox.addEventListener('change', function() {
    if (this.checked) {
        document.getElementById('promoImgHolder').style.display = "block";
    } else {
        document.getElementById('promoImgHolder').style.display = "none";
    }
});


$('#joinPartyButton').css({'right': '10%',
                           'left': '70%',
                           'text-align': 'center',
                           'bottom': '48px',
                           'font-size': '24px',
                           'top': 'unset'});

$('#linksContainer2').css({'-webkit-border-radius': '0px 0 0 0',
                           '-moz-border-radius': '0px 0 0 0',
                           'border-radius': '0px 0 0 0',
                           'right': '44%',
                           'left': '44%',
                           'background-color': 'rgba(0, 0, 0, 0.74)',
                           'text-align': 'center',
                           'bottom': '12px'});

$('#gameName').css({'color': '#20ace8',
                    'text-shadow': '0 1px 0 rgba(255, 255, 255, 0), 0 2px 0 rgba(255, 255, 255, 0), 0 3px 0 rgba(255, 255, 255, 0), 0 4px 0 rgba(255, 255, 255, 0), 0 5px 0 rgba(255, 255, 255, 0), 0 6px 0 rgba(255, 255, 255, 0), 0 7px 0 rgba(255, 255, 255, 0), 0 8px 0 rgba(255, 255, 255, 0), 0 9px 0 rgba(255, 255, 255, 0)',
                    'text-align': 'center',
                    'font-size': '156px',
                    'margin-bottom': '-30px'});


$("#killCounter").css({'bottom': '75px'});
const miniMenu = document.createElement("div");
miniMenu.textContent = "Hello!";
miniMenu.style.position = "fixed";
miniMenu.style.top = "-100px";
miniMenu.style.left = "50%";
miniMenu.style.transform = "translateX(-50%)";
miniMenu.style.backgroundColor = "rgba(51, 51, 51, 0)";
miniMenu.style.color = "rgb(51, 51, 51)";
miniMenu.style.padding = "20px";
miniMenu.style.fontSize = "20px";
miniMenu.style.borderRadius = "10px";
miniMenu.style.transition = "top 1s, opacity 1s";
miniMenu.style.zIndex = "9999";
document.body.appendChild(miniMenu);
$("#killCounter").hide();
setTimeout(() => {
    miniMenu.style.top = "0";
    miniMenu.style.opacity = "1";
}, 500);

setTimeout(() => {
    miniMenu.style.opacity = "0";
    setTimeout(() => {
        miniMenu.remove();
    }, 1000);
}, 3000);
const miniMenu2W = document.createElement("div");
miniMenu2W.textContent = "U Best!";
miniMenu2W.style.position = "fixed";
miniMenu2W.style.top = "-100px";
miniMenu2W.style.left = "50%";
miniMenu2W.style.transform = "translateX(-50%)";
miniMenu2W.style.backgroundColor = "rgba(51, 51, 51, 0)";
miniMenu2W.style.color = "rgb(51, 51, 51)";
miniMenu2W.style.padding = "20px";
miniMenu2W.style.fontSize = "20px";
miniMenu2W.style.borderRadius = "10px";
miniMenu2W.style.transition = "top 1s, opacity 1s";
miniMenu2W.style.zIndex = "9999";
document.body.appendChild(miniMenu2W);
setTimeout(() => {
    miniMenu2W.style.top = "25px";
    miniMenu2W.style.opacity = "1";
}, 1500);
setTimeout(() => {
    miniMenu2W.style.top = "0";
    miniMenu2W.style.opacity = "1";
}, 3000);

setTimeout(() => {
    miniMenu2W.style.opacity = "0";
    setTimeout(() => {
        miniMenu2W.remove();
    }, 1000);
}, 5000);
if (document.querySelector("#customAudioPlayer")) return;
var audioFiles = [
    {
        url: "https://cdn.discordapp.com/attachments/1062441866416619653/1069324203297362040/Barren_Gates_-_Obey_NCS_Release.mp3",
        title: "Obey NCS",
    },
    {
        url: "https://cdn.discordapp.com/attachments/1062441866416619653/1069323837608570941/Clarx_-_Zig_Zag_NCS_Release.mp3",
        title: "Zig Zag NCS",
    },
    {
        url: "https://mp3uk.net/mp3/files/camila-cabello-shameless-speed-up-mp3.mp3",
        title: "Shameless NightCore",
    },
    {
        url: "https://cdn.muzyet.net/?h=JGraYpdVSDsfzqI6llpTKMlEiImFeJbLMMCCdCz_6oBSV99ikBBdVB61Y4O5JTP21hJcoINim8I-f5B7bS_2kiJK42OQFn1KHMmijcklVC_XPI_YmW0\\",
        title: "VTZE ARCHIVE MONTAGEM",
    },
    {
        url: "https://ncs.io/track/download/ca453e1c-3c56-488f-854a-d022e46c7ebf",
        title: "Slippy & Blosso Horizon",
    },
    {
        url: "https://cdn.discordapp.com/attachments/1062441866416619653/1069300879708135524/Anixto_-_Ride_Or_Die_NCS_Release.mp3",
        title: "Ride Or Die NCS",
    },
    {
        url: "https://cdn.discordapp.com/attachments/1062441866416619653/1069324799903531128/MP3DL.CC_Rival_-_Throne_-_ft._Neoni_NCS_Release-256k.mp3",
        title: "Throne NCS",
    },
    {
        url: "https://cdn.discordapp.com/attachments/905994516719345664/918544988965568562/Dirty_Palm_-_Ropes_feat._Chandler_Jewels_NCS10_Release.mp3",
        title: "Ropes NCS",
    },
    {
        url: "https://cdn.discordapp.com/attachments/905994516719345664/918546211584213023/Jonth_Tom_Wilson_Facading_MAGNUS_Jagsy_Vosai_RudeLies__Domastic_-_Heartless_NCS10_Release.mp3",
        title: "Heartless NCS",
    },
    {
        url: "https://cdn.discordapp.com/attachments/905873563490328626/920005714481672212/Anikdote_-_Turn_It_Up_NCS_Release.mp3",
        title: "Turn It Up NCS",
    },
    {
        url: "https://cdn.discordapp.com/attachments/905873563490328626/920006439999778856/Unknown_Brain_-_MATAFAKA_feat._Marvin_Divine_NCS_Release.mp3",
        title: "MATAFKA NCS",
    },
    {
        url: "https://cdn.discordapp.com/attachments/905994516719345664/918910823290769458/koven_never_have_i_felt_this_ncs_release_gqEQ_nIByoK-gucZcxBO.mp3",
        title: "Never Have I Felt This NCS",
    },
    {
        url: "https://cdn.discordapp.com/attachments/905994516719345664/925144953611505714/Rebel_Scum__Dani_King__Centrix_-_Calm_Before_The_Storm_NCS_Release.mp3",
        title: "Calm Before The Storm NCS",
    },
];
var currentIndex = 0;
var audio = new Audio(audioFiles[currentIndex].url);
audio.preload = "auto";
audio.volume = 1;
var repeat = false;
var shuffled = false;
function playNext() {
    if (shuffled) {
        currentIndex = Math.floor(Math.random() * audioFiles.length);
    } else if (!repeat) {
        currentIndex = (currentIndex + 1) % audioFiles.length;
    }
    audio.src = audioFiles[currentIndex].url;
    audio.play();
    playButton.textContent = "Pause";
    playButton.style.background = "red";
    var trackButtons = document.querySelectorAll(".track-button");
    trackButtons.forEach(function (trackButton, index) {
        if (index === currentIndex) {
            trackButton.classList.add("active");
        } else {
            trackButton.classList.remove("active");
        }
    });
}
function formatDuration(duration) {
    var minutes = Math.floor(duration / 60);
    var seconds = Math.floor(duration % 60);
    return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}
audio.addEventListener("ended", playNext);
audio.addEventListener("timeupdate", function () {
    durationDisplay.textContent =
        formatDuration(audio.currentTime) + "/" + formatDuration(audio.duration);
});
var player = document.createElement("div");
player.id = "customAudioPlayer";
player.style =
    "position:fixed;top:20%;left:5px;z-index:10001;background:transparent;padding:20px;border-radius:10px;width:300px;color:#fff;box-shadow:0px 0px 20px 5px rgba(0,0,0,0);display:none;flex-direction:column;align-items:center;";
var playButton = document.createElement("button");
playButton.textContent = "Play";
playButton.style =
    "margin-top:10px;width:100%;padding:10px;border:none;border-radius:5px;background-color:green;color:white;cursor:pointer;";
playButton.onclick = function () {
    if (audio.paused) {
        audio.play();
        this.textContent = "Pause";
        this.style.background = "red";
    } else {
        audio.pause();
        this.textContent = "Play";
        this.style.background = "green";
    }
};

let musicV;
player.appendChild(playButton);
var nextButton = document.createElement("button");
nextButton.textContent = "Next";
nextButton.style =
    "margin-top:10px;width:100%;padding:10px;border:none;border-radius:5px;background-color:white;color:black;cursor:pointer;";
nextButton.onclick = playNext;
player.appendChild(nextButton);
var shuffleRepeatContainer = document.createElement("div");
shuffleRepeatContainer.style =
    "display:flex;justify-content:space-between;width:100%;margin-top:10px;";
player.appendChild(shuffleRepeatContainer);
var shuffleButton = document.createElement("button");
shuffleButton.textContent = "Shuffle: Off";
shuffleButton.style =
    "padding:10px;border:none;border-radius:5px;background-color:black;color:white;cursor:pointer;width:48%;";
shuffleButton.onclick = function () {
    shuffled = !shuffled;
    this.textContent = shuffled ? "Shuffle: On" : "Shuffle: Off";
};
shuffleRepeatContainer.appendChild(shuffleButton);
var repeatButton = document.createElement("button");
repeatButton.textContent = "Repeat: Off";
repeatButton.style =
    "padding:10px;border:none;border-radius:5px;background-color:black;color:white;cursor:pointer;width:48%;";
repeatButton.onclick = function () {
    repeat = !repeat;
    this.textContent = repeat ? "Repeat: On" : "Repeat: Off";
};
shuffleRepeatContainer.appendChild(repeatButton);
var durationDisplay = document.createElement("div");
durationDisplay.style = "margin-top:10px;text-align:center;";
player.appendChild(durationDisplay);
var trackList = document.createElement("div");
trackList.style =
    "overflow:auto;max-height:150px;margin-top:20px;border:1px solid #fff;border-radius:10px;padding:5px;";
audioFiles.forEach(function (track, index) {
    var trackButton = document.createElement("button");
    trackButton.textContent = track.title;
    trackButton.classList.add("track-button");
    trackButton.style =
        "padding:5px;border:none;border-radius:5px;background-color:black;color:white;cursor:pointer;width:100%;text-align:left;margin-top:5px;";
    trackButton.onclick = function () {
        currentIndex = index;
        audio.src = track.url;
        audio.play();
        playButton.textContent = "Pause";
        playButton.style.background = "red";
        trackButtons.forEach(function (trackButton, i) {
            if (i === currentIndex) {
                trackButton.classList.add("active");
            } else {
                trackButton.classList.remove("active");
            }
        });
    };
    trackList.appendChild(trackButton);
});
player.appendChild(trackList);
var activeButtonStyle = document.createElement("style");
activeButtonStyle.innerHTML = ".track-button.active{background-color:green;}";
document.head.appendChild(activeButtonStyle);
var madeByLabel = document.createElement("div");
madeByLabel.style = "margin-top:auto;text-align:center;";
player.appendChild(madeByLabel);
document.body.appendChild(player);
document.addEventListener("keydown", function (e) {
    if (e.key === "`" && document.activeElement.id.toLowerCase() !== "chatbox") {
        player.style.display = player.style.display === "none" ? "flex" : "none";
    }
});
$("#chatButton").remove();
document.querySelector("#joinPartyButton").remove();
document.querySelector("#pre-content-container").remove();
document.getElementById("loadingText").style.color = `rgb(51, 51, 51)`;
//document.getElementById("mainMenu").style.backgroundImage = "url('https://cdn.discordapp.com/attachments/958988020349014016/1206184581162598400/Untitled5_20240211141610.png?ex=65db15ed&is=65c8a0ed&hm=28dcf76dd00c5c7282bd6591b2340f0905fc554fed548080ff4aef1d5520df53&')";
$("#mapDisplay").css({background: `url('https://i.imgur.com/fgFsQJp.png')`});
document.getElementById("storeHolder").style = "height: 410px; width: 450px;"
let antiSync = false;
let topInfoHolder = true;
let myObjectHealth = "#5f9ea0";
let enemyObjectHealth = "#ff6363";
let Fo = -1;
let second = -1;
let highestArr = [];
let highestMs = -1;
let averageArr = [];
let averageMs = -1;
let damageTextColor = "#fff";
let healTextColor = "#8ecc51";
let preplaceDelay = {
    killObject: -1,
    gatherAnimation: -1,
    total: function() {
        return (new Date() - Math.abs(Math.trunc(this.killObject - this.gatherAnimation)));
    },
}
let autoPushLine = "#fff";
let useHack = true;
let log = console.log;
let testMode = window.location.hostname == "127.0.0.1";
const buttonL = document.querySelector("#leaderboardButton");
const nameInputElement = document.getElementById("nameInput");
if (nameInputElement) {
    nameInputElement.style.color = "#333";
}
buttonL.addEventListener('click', function () {
    $("#menuChatDiv").toggle();
    $("#menuDiv").hide();
});
document.getElementById('promoImgHolder').style.display = "none";
document.getElementById('promoImgHolder').innerHTML =
    `
  <style>
  #linksContainer2 { background: #ccc; border-top: 5px solid; border-image: linear-gradient(to right,#333,#333) 1 1 0 0; height: 18px; top: 0%; color: #333; transition: 0.3s;
  } #linksContainer2:hover { background: #ccc; box-shadow: 0 0 20px #333;
  } #top-wrap-right { color: #333;
  } .check-box {transform: scale(1.1);
  } .inParty {display: none;
  } input[type="checkbox"] { position: relative; appearance: none; width: 33px; height: 15.5px; border-radius: 50px; box-shadow: inset 0 0 5px rgba(41, 41, 41, 0.8); cursor: pointer; top: 7.5px; transition: 0.7s;
  } input:checked[type="checkbox"] { background: rgba(51, 51, 51);
  } input[type="checkbox"]::after { position: absolute; content: ""; width: 15.5px; height: 15.5px; top: 0; left: 0; background: #fff; border-radius: 50%; box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); transform: scale(1.1); transition: 0.7s;
  } input:checked[type="checkbox"]::after { left: 50%;
  } .menuCard { background-color: #181818; border-top: 5px solid; border-image: linear-gradient(to right,#333,#303030) 1 0 0 0; color: #333; margin-top:0px; border-radius: 0px; border-bottom: 0px solid red; transition: all 1s; transform: scale(1); box-shadow: 0px 0px #333; transform: translateX(0px);
  } .menuCard.active { transform: translateX(0px);
  } #adCard { display: none;
  } #adCard { display: none;
  } #promoImgHolder { overflow-y: scroll; -ms-overflow-style: none; scrollbar-width: none; height: 90px; max-height: 90px; }
  </div><br>
  `
document.getElementById("enterGame").addEventListener("click", autohide);
function autohide() {
    $("#ot-sdk-btn-floating").hide();
}
$('#subConfirmationElement').click( () => {
    try { window.follmoo(); } catch(e){};
    localStorage["moofoll"] = "1"; localStorage["moofol"] = "1";
});
$("#gameName").css({
    color: "#333",
    "text-shadow": "0 1px 0 #181818, 0 2px 0 #181818, 0 3px 0 #181818, 0 4px 0 #181818, 0 5px 0 #181818, 0 6px 0 #181818, 0 7px 0 #181818, 0 8px 0 #181818, 0 9px 0 #181818, rgba(0, 0, 0, 0.4) 1px 1px 40px",
    "text-align": "center",
    "font-size": "156px",
    "margin-bottom": "-30px",
});
$('#linksContainer2').remove();
function getEl(id) {
    return document.getElementById(id);
}
let firstConfig = [];
let streamerMode = false;
const HTML = {
    newLine: function(amount) {
        let text = ``;
        for (let i = 0; i < amount; i++) {
            text += `<br>`;
        }
        return text;
    },
    line: function() {
        return `<hr>`;
    },
    text: function(id, value, size, length) {
        return `<input type = "text" id = ${id} size = ${size} value = ${value} maxlength = ${length}>`;
    },
    checkBox: function(id, name, checked, rl) {
        return `${rl ? name + ` ` : ``}<input type = "checkbox" ${checked ? `checked` : ``} id = ${id}>${rl ? `` : ` ` + name}`;
    },
    button: function(id, name, onclick, classs) {
        return `<button class = ${classs} id = ${id} onclick = ${onclick}>${name}</button>`;
    },
    select: function(id, selects) {
        let text = `<select id = ${id}>`;
        selects.forEach((e,i)=>{
            text += `<option value = ${e.value} ${e.selected ? ` selected` : ``}>${e.name}</option>`;
            if (i == selects.length - 1) {
                text += `</select>`;
            }
        }
                       );
        return text;
    },
    modChange: function(id, selects) {
        console.log("test");
    },
    mod: function(id, selects) {
        let text = `<select id = ${id}>`;
        selects.forEach((e,i)=>{
            text += `<option value = ${e.value + "C"}>${e.name}</option>`;
            if (i == selects.length - 1) {
                text += `</select> `;
            }
            if (i == 0) {
                firstConfig.push(e.value + "C");
            }
        }
                       );
        selects.forEach((e,i)=>{
            text += `<input type = "checkbox"  ${e.checked ? `checked` : ``} id = ${e.value} style = "${i == 0 ? "display: inline-block;" : "display: none;"}">`;
        }
                       );
        return text;
    },
    hotkey: function(id, value, size, length) {
        return `<input type = "text" id = ${id} size = ${size} value = ${value} maxlength = ${length}><input type = "checkbox" checked id = ${id + "k"}>`;
    },
};

function getTabId(el) {
    return el.id == "tHome" ? "homeTab" : el.id == "t1" ? "miscTab" : el.id == "t2" ? "configTab" : el.id == "t3" ? "combatTab" : "homeTab";
}
let accEls = {
    11: true,
    19: true,
    13: true,
    18: true,
    21: true
}

var modMenus6 = document.createElement("div");
modMenus6.id = "modMenus6";
document.body.append(modMenus6);
modMenus6.style.display = "block";
modMenus6.style = `
display: block;
text-align: left;
padding: 10px;
background-color: transparent;
color: white;
position: absolute;
left: 20px;
top: 20px;
::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 10px;
}
::-webkit-scrollbar {
    -webkit-appearance: none;
    width: 10px;
}
::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: rgba(0,0,0,.5);
    -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);
}
::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background-color: rgba(0,0,0,.5);
    -webkit-box-shadow: 0 0 1px rgba(255,255,255,.5);
}
width: 10px;
height: 7;
transition: 2s;
overflow: auto;
`;
let canmove = true;
function updateInnerHTML() {
    modMenus6.innerHTML = `
    <style>
    .sizing {
                    font-size: 15px;
                }
                .mod {
                    font-size: 15px;
                    display: inline-block;
                }
                .augh {
                    display: none;
                    width: 35px;
                    height: 35px;
                    background-size: cover;
                    background-color: #fff;
                    opacity: 0.4;
                }
                .augh1 {
                    display: none;
                    width: 35px;
                    height: 35px;
                    background-size: cover;
                    background-color: #fff;
                    opacity: 0.4;
                }
                .augh2 {
                    display: none;
                    width: 35px;
                    height: 35px;
                    background-size: cover;
                    background-color: #fff;
                    opacity: 0.4;
                }
                .augh3 {
                    display: none;
                    width: 35px;
                    height: 35px;
                    background-size: cover;
                    background-color: #fff;
                    opacity: 0.4;
                }
                .augh4 {
                    display: none;
                    width: 35px;
                    height: 35px;
                    background-size: cover;
                    background-color: #fff;
                    opacity: 0.4;
                }
                .augh5 {
                    display: none;
                    width: 35px;
                    height: 35px;
                    background-size: cover;
                    background-color: #fff;
                    opacity: 0.4;
                }
                .augh6 {
                    display: none;
                    width: 35px;
                    height: 35px;
                    background-size: cover;
                    background-color: #fff;
                    opacity: 0.4;
                }
                .augh7 {
                    display: none;
                    width: 35px;
                    height: 35px;
                    background-size: cover;
                    background-color: #fff;
                    opacity: 0.4;
                }
                .augh8 {
                    display: none;
                    width: 35px;
                    height: 35px;
                    background-size: cover;
                    background-color: #fff;
                    opacity: 0.4;
                }
                .augh9 {
                    display: none;
                    width: 35px;
                    height: 35px;
                    background-size: cover;
                    background-color: #fff;
                    opacity: 0.4;
                }
                .augh:active {
                    background-color: green;
                }
               <style>
               .augh {
                 cursor: grab;
               }
                .augh1:active {
                    background-color: green;
                }
               <style>
               .augh1 {
                 cursor: grab;
               }
                .augh2:active {
                    background-color: green;
                }
               <style>
               .augh2 {
                 cursor: grab;
               }
                .augh3:active {
                    background-color: green;
                }
               <style>
               .augh3 {
                 cursor: grab;
               }
                .augh4:active {
                    background-color: green;
                }
               <style>
               .augh4 {
                 cursor: grab;
               }
                .augh5:active {
                    background-color: green;
                }
               <style>
               .augh5 {
                 cursor: grab;
               }
                .augh6:active {
                    background-color: green;
                }
               <style>
               .augh6 {
                 cursor: grab;
               }
                .augh7:active {
                    background-color: green;
                }
               <style>
               .augh7 {
                 cursor: grab;
               }
                .augh8:active {
                    background-color: green;
                }
               <style>
               .augh8 {
                 cursor: grab;
               }
                .augh9:active {
                    background-color: green;
                }
               <style>
               .augh9 {
                 cursor: grab;
               }
</style>


<div style = "display: block">
<div id = "hatdisp22" class = "augh" style = "background-image: url(https://moomoo.io/img/hats/hat_22.png);"></div>
<div id = "hatdisp7" class = "augh1" style = "background-image: url(https://moomoo.io/img/hats/hat_7.png);"></div>
<div id = "hatdisp6" class = "augh2" style = "background-image: url(https://moomoo.io/img/hats/hat_6.png);"></div>
<div id = "hatdisp40" class = "augh3" style = "background-image: url(https://moomoo.io/img/hats/hat_40.png);"></div>
<div id = "hatdisp21" class = "augh4" style = "background-image: url(https://moomoo.io/img/hats/hat_21.png);"></div>
<div style = "display: block">
<div id = "hatdisp12" class = "augh5" style = "background-image: url(https://moomoo.io/img/hats/hat_12.png);"></div>
<div id = "hatdisp56" class = "augh6" style = "background-image: url(https://moomoo.io/img/hats/hat_56.png);"></div>
<div id = "accdisp19" class = "augh7" style = "background-image: url(http://moomoo.io/img/accessories/access_19.png);"></div>
<div id = "accdisp18" class = "augh8" style = "background-image: url(http://moomoo.io/img/accessories/access_18.png);"></div>
<div id = "accdisp21" class = "augh9" style = "background-image: url(http://moomoo.io/img/accessories/access_21.png);"></div>
</div>
`;
}
updateInnerHTML();

var EasyStar = function(e) {
    var o = {};
    function r(t) {
        if (o[t]) return o[t].exports;
        var n = o[t] = {
            i: t,
            l: !1,
            exports: {}
        };
        return e[t].call(n.exports, n, n.exports, r), n.l = !0, n.exports
    }
    return r.m = e, r.c = o, r.d = function(t, n, e) {
        r.o(t, n) || Object.defineProperty(t, n, {
            enumerable: !0,
            get: e
        })
    }, r.r = function(t) {
        "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
            value: "Module"
        }), Object.defineProperty(t, "__esModule", {
            value: !0
        })
    }, r.t = function(n, t) {
        if (1 & t && (n = r(n)), 8 & t) return n;
        if (4 & t && "object" == typeof n && n && n.__esModule) return n;
        var e = Object.create(null);
        if (r.r(e), Object.defineProperty(e, "default", {
            enumerable: !0,
            value: n
        }), 2 & t && "string" != typeof n)
            for (var o in n) r.d(e, o, function(t) {
                return n[t]
            }.bind(null, o));
        return e
    }, r.n = function(t) {
        var n = t && t.__esModule ? function() {
            return t.default
        } : function() {
            return t
        };
        return r.d(n, "a", n), n
    }, r.o = function(t, n) {
        return Object.prototype.hasOwnProperty.call(t, n)
    }, r.p = "/bin/", r(r.s = 0)
}([function(t, n, e) {
    var P = {},
        M = e(1),
        _ = e(2),
        A = e(3);
    t.exports = P;
    var E = 1;
    P.js = function() {
        var c, i, f, s = 1.4,
            p = !1,
            u = {},
            o = {},
            r = {},
            l = {},
            a = !0,
            h = {},
            d = [],
            y = Number.MAX_VALUE,
            v = !1;
        this.setAcceptableTiles = function(t) {
            t instanceof Array ? f = t : !isNaN(parseFloat(t)) && isFinite(t) && (f = [t])
        }, this.enableSync = function() {
            p = !0
        }, this.disableSync = function() {
            p = !1
        }, this.enableDiagonals = function() {
            v = !0
        }, this.disableDiagonals = function() {
            v = !1
        }, this.setGrid = function(t) {
            c = t;
            for (var n = 0; n < c.length; n++)
                for (var e = 0; e < c[0].length; e++) o[c[n][e]] || (o[c[n][e]] = 1)
        }, this.setTileCost = function(t, n) {
            o[t] = n
        }, this.setAdditionalPointCost = function(t, n, e) {
            void 0 === r[n] && (r[n] = {}), r[n][t] = e
        }, this.removeAdditionalPointCost = function(t, n) {
            void 0 !== r[n] && delete r[n][t]
        }, this.removeAllAdditionalPointCosts = function() {
            r = {}
        }, this.setDirectionalCondition = function(t, n, e) {
            void 0 === l[n] && (l[n] = {}), l[n][t] = e
        }, this.removeAllDirectionalConditions = function() {
            l = {}
        }, this.setIterationsPerCalculation = function(t) {
            y = t
        }, this.avoidAdditionalPoint = function(t, n) {
            void 0 === u[n] && (u[n] = {}), u[n][t] = 1
        }, this.stopAvoidingAdditionalPoint = function(t, n) {
            void 0 !== u[n] && delete u[n][t]
        }, this.enableCornerCutting = function() {
            a = !0
        }, this.disableCornerCutting = function() {
            a = !1
        }, this.stopAvoidingAllAdditionalPoints = function() {
            u = {}
        }, this.findPath = function(t, n, e, o, r) {
            function i(t) {
                p ? r(t) : setTimeout(function() {
                    r(t)
                })
            }
            if (void 0 === f) throw new Error("You can't set a path without first calling setAcceptableTiles() on EasyStar.");
            if (void 0 === c) throw new Error("You can't set a path without first calling setGrid() on EasyStar.");
            if (t < 0 || n < 0 || e < 0 || o < 0 || t > c[0].length - 1 || n > c.length - 1 || e > c[0].length - 1 || o > c.length - 1)// throw new Error("Your start or end point is outside the scope of your grid.");
                if (t !== e || n !== o) {
                    for (var s = c[o][e], u = !1, l = 0; l < f.length; l++)
                        if (s === f[l]) {
                            u = !0;
                            break
                        } if (!1 !== u) {
                            var a = new M;
                            a.openList = new A(function(t, n) {
                                return t.bestGuessDistance() - n.bestGuessDistance()
                            }), a.isDoneCalculating = !1, a.nodeHash = {}, a.startX = t, a.startY = n, a.endX = e, a.endY = o, a.callback = i, a.openList.push(O(a, a.startX, a.startY, null, 1));
                            o = E++;
                            return h[o] = a, d.push(o), o
                        }
                    i(null)
                } else i([])
        }, this.cancelPath = function(t) {
            return t in h && (delete h[t], !0)
        }, this.calculate = function() {
            if (0 !== d.length && void 0 !== c && void 0 !== f)
                for (i = 0; i < y; i++) {
                    if (0 === d.length) return;
                    p && (i = 0);
                    var t = d[0],
                        n = h[t];
                    if (void 0 !== n)
                        if (0 !== n.openList.size()) {
                            var e = n.openList.pop();
                            if (n.endX !== e.x || n.endY !== e.y) (e.list = 0) < e.y && T(n, e, 0, -1, +b(e.x, e.y - 1)), e.x < c[0].length - 1 && T(n, e, 1, 0, +b(e.x + 1, e.y)), e.y < c.length - 1 && T(n, e, 0, 1, +b(e.x, e.y + 1)), 0 < e.x && T(n, e, -1, 0, +b(e.x - 1, e.y)), v && (0 < e.x && 0 < e.y && (a || g(c, f, e.x, e.y - 1, e) && g(c, f, e.x - 1, e.y, e)) && T(n, e, -1, -1, s * b(e.x - 1, e.y - 1)), e.x < c[0].length - 1 && e.y < c.length - 1 && (a || g(c, f, e.x, e.y + 1, e) && g(c, f, e.x + 1, e.y, e)) && T(n, e, 1, 1, s * b(e.x + 1, e.y + 1)), e.x < c[0].length - 1 && 0 < e.y && (a || g(c, f, e.x, e.y - 1, e) && g(c, f, e.x + 1, e.y, e)) && T(n, e, 1, -1, s * b(e.x + 1, e.y - 1)), 0 < e.x && e.y < c.length - 1 && (a || g(c, f, e.x, e.y + 1, e) && g(c, f, e.x - 1, e.y, e)) && T(n, e, -1, 1, s * b(e.x - 1, e.y + 1)));
                            else {
                                var o = [];
                                o.push({
                                    x: e.x,
                                    y: e.y
                                });
                                for (var r = e.parent; null != r;) o.push({
                                    x: r.x,
                                    y: r.y
                                }), r = r.parent;
                                o.reverse(), n.callback(o), delete h[t], d.shift()
                            }
                        } else n.callback(null), delete h[t], d.shift();
                    else d.shift()
                }
        };
        var T = function(t, n, e, o, r) {
            e = n.x + e, o = n.y + o;
            void 0 !== u[o] && void 0 !== u[o][e] || !g(c, f, e, o, n) || (void 0 === (o = O(t, e, o, n, r)).list ? (o.list = 1, t.openList.push(o)) : n.costSoFar + r < o.costSoFar && (o.costSoFar = n.costSoFar + r, o.parent = n, t.openList.updateItem(o)))
        },
            g = function(t, n, e, o, r) {
                var i = l[o] && l[o][e];
                if (i) {
                    var s = x(r.x - e, r.y - o);
                    if (! function() {
                        for (var t = 0; t < i.length; t++)
                            if (i[t] === s) return !0;
                        return !1
                    }()) return !1
                }
                for (var u = 0; u < n.length; u++)
                    if (t[o][e] === n[u]) return !0;
                return !1
            },
            x = function(t, n) {
                if (0 === t && -1 === n) return P.TOP;
                if (1 === t && -1 === n) return P.TOP_RIGHT;
                if (1 === t && 0 === n) return P.RIGHT;
                if (1 === t && 1 === n) return P.BOTTOM_RIGHT;
                if (0 === t && 1 === n) return P.BOTTOM;
                if (-1 === t && 1 === n) return P.BOTTOM_LEFT;
                if (-1 === t && 0 === n) return P.LEFT;
                if (-1 === t && -1 === n) return P.TOP_LEFT;
                throw new Error("These differences are not valid: " + t + ", " + n)
            },
            b = function(t, n) {
                return r[n] && r[n][t] || o[c[n][t]]
            },
            O = function(t, n, e, o, r) {
                if (void 0 !== t.nodeHash[e]) {
                    if (void 0 !== t.nodeHash[e][n]) return t.nodeHash[e][n]
                } else t.nodeHash[e] = {};
                var i = m(n, e, t.endX, t.endY),
                    r = null !== o ? o.costSoFar + r : 0,
                    i = new _(o, n, e, r, i);
                return t.nodeHash[e][n] = i
            },
            m = function(t, n, e, o) {
                var r, i;
                return v ? (r = Math.abs(t - e)) < (i = Math.abs(n - o)) ? s * r + i : s * i + r : (r = Math.abs(t - e)) + (i = Math.abs(n - o))
            }
        }, P.TOP = "TOP", P.TOP_RIGHT = "TOP_RIGHT", P.RIGHT = "RIGHT", P.BOTTOM_RIGHT = "BOTTOM_RIGHT", P.BOTTOM = "BOTTOM", P.BOTTOM_LEFT = "BOTTOM_LEFT", P.LEFT = "LEFT", P.TOP_LEFT = "TOP_LEFT"
}, function(t, n) {
    t.exports = function() {
        this.pointsToAvoid = {}, this.startX, this.callback, this.startY, this.endX, this.endY, this.nodeHash = {}, this.openList
    }
}, function(t, n) {
    t.exports = function(t, n, e, o, r) {
        this.parent = t, this.x = n, this.y = e, this.costSoFar = o, this.simpleDistanceToTarget = r, this.bestGuessDistance = function() {
            return this.costSoFar + this.simpleDistanceToTarget
        }
    }
}, function(t, n, e) {
    t.exports = e(4)
}, function(u, T, t) {
    var g, x;
    (function() {
        var t, p, l, h, d, n, a, e, y, v, o, r, i, c, f;
        function s(t) {
            this.cmp = null != t ? t : p, this.nodes = []
        }
        l = Math.floor, v = Math.min, p = function(t, n) {
            return t < n ? -1 : n < t ? 1 : 0
        }, y = function(t, n, e, o, r) {
            var i;
            if (null == e && (e = 0), null == r && (r = p), e < 0) throw new Error("lo must be non-negative");
            for (null == o && (o = t.length); e < o;) r(n, t[i = l((e + o) / 2)]) < 0 ? o = i : e = i + 1;
            return [].splice.apply(t, [e, e - e].concat(n)), n
        }, n = function(t, n, e) {
            return null == e && (e = p), t.push(n), c(t, 0, t.length - 1, e)
        }, d = function(t, n) {
            var e, o;
            return null == n && (n = p), e = t.pop(), t.length ? (o = t[0], t[0] = e, f(t, 0, n)) : o = e, o
        }, e = function(t, n, e) {
            var o;
            return null == e && (e = p), o = t[0], t[0] = n, f(t, 0, e), o
        }, a = function(t, n, e) {
            var o;
            return null == e && (e = p), t.length && e(t[0], n) < 0 && (n = (o = [t[0], n])[0], t[0] = o[1], f(t, 0, e)), n
        }, h = function(e, t) {
            var n, o, r, i, s, u;
            for (null == t && (t = p), s = [], o = 0, r = (i = function() {
                u = [];
                for (var t = 0, n = l(e.length / 2); 0 <= n ? t < n : n < t; 0 <= n ? t++ : t--) u.push(t);
                return u
            }.apply(this).reverse()).length; o < r; o++) n = i[o], s.push(f(e, n, t));
            return s
        }, i = function(t, n, e) {
            if (null == e && (e = p), -1 !== (n = t.indexOf(n))) return c(t, 0, n, e), f(t, n, e)
        }, o = function(t, n, e) {
            var o, r, i, s, u;
            if (null == e && (e = p), !(r = t.slice(0, n)).length) return r;
            for (h(r, e), i = 0, s = (u = t.slice(n)).length; i < s; i++) o = u[i], a(r, o, e);
            return r.sort(e).reverse()
        }, r = function(t, n, e) {
            var o, r, i, s, u, l, a, c, f;
            if (null == e && (e = p), 10 * n <= t.length) {
                if (!(i = t.slice(0, n).sort(e)).length) return i;
                for (r = i[i.length - 1], s = 0, l = (a = t.slice(n)).length; s < l; s++) e(o = a[s], r) < 0 && (y(i, o, 0, null, e), i.pop(), r = i[i.length - 1]);
                return i
            }
            for (h(t, e), f = [], u = 0, c = v(n, t.length); 0 <= c ? u < c : c < u; 0 <= c ? ++u : --u) f.push(d(t, e));
            return f
        }, c = function(t, n, e, o) {
            var r, i, s;
            for (null == o && (o = p), r = t[e]; n < e && o(r, i = t[s = e - 1 >> 1]) < 0;) t[e] = i, e = s;
            return t[e] = r
        }, f = function(t, n, e) {
            var o, r, i, s, u;
            for (null == e && (e = p), r = t.length, i = t[u = n], o = 2 * n + 1; o < r;)(s = o + 1) < r && !(e(t[o], t[s]) < 0) && (o = s), t[n] = t[o], o = 2 * (n = o) + 1;
            return t[n] = i, c(t, u, n, e)
        }, s.push = n, s.pop = d, s.replace = e, s.pushpop = a, s.heapify = h, s.updateItem = i, s.nlargest = o, s.nsmallest = r, s.prototype.push = function(t) {
            return n(this.nodes, t, this.cmp)
        }, s.prototype.pop = function() {
            return d(this.nodes, this.cmp)
        }, s.prototype.peek = function() {
            return this.nodes[0]
        }, s.prototype.contains = function(t) {
            return -1 !== this.nodes.indexOf(t)
        }, s.prototype.replace = function(t) {
            return e(this.nodes, t, this.cmp)
        }, s.prototype.pushpop = function(t) {
            return a(this.nodes, t, this.cmp)
        }, s.prototype.heapify = function() {
            return h(this.nodes, this.cmp)
        }, s.prototype.updateItem = function(t) {
            return i(this.nodes, t, this.cmp)
        }, s.prototype.clear = function() {
            return this.nodes = []
        }, s.prototype.empty = function() {
            return 0 === this.nodes.length
        }, s.prototype.size = function() {
            return this.nodes.length
        }, s.prototype.clone = function() {
            var t = new s;
            return t.nodes = this.nodes.slice(0), t
        }, s.prototype.toArray = function() {
            return this.nodes.slice(0)
        }, s.prototype.insert = s.prototype.push, s.prototype.top = s.prototype.peek, s.prototype.front = s.prototype.peek, s.prototype.has = s.prototype.contains, s.prototype.copy = s.prototype.clone, t = s, g = [], void 0 === (x = "function" == typeof (x = function() {
            return t
        }) ? x.apply(T, g) : x) || (u.exports = x)
    }).call(this)
}]);
let easystar = new EasyStar.js();
!function(run) {
    if (!run) return;
    let codes = {
        setup: () => {
            "use strict";
            let newFont = document.createElement("link");
            newFont.rel = "stylesheet";
            newFont.href = "https://fonts.googleapis.com/css?family=Ubuntu:700";
            newFont.type = "text/css";
            document.body.append(newFont);
            let min = document.createElement("script");
            min.src = "https://rawgit.com/kawanet/msgpack-lite/master/dist/msgpack.min.js";
            document.body.append(min);
        },
        main: () => {
            if (!useHack) {
                return;
            }
            "use strict";
            let scriptTags = document.getElementsByTagName("script");
            for (let i = 0; i < scriptTags.length; i++) {
                if (scriptTags[i].src.includes("bundle.js")) {
                    scriptTags[i].remove();
                    break;
                }
            }
            window.oncontextmenu = function() {
                return false;
            };
            let config = window.config;
            config.clientSendRate = 9;
            config.serverUpdateRate = 9;
            config.deathFadeout = 0;
            config.isSandbox = window.location.hostname == "sandbox.moomoo.io";
            config.skinColors = ["#bf8f54", "#cbb091", "#896c4b",
                                 "#fadadc", "#ececec", "#c37373", "#4c4c4c", "#ecaff7", "#738cc3",
                                 "#8bc373", "#91b2db"
                                ];
            config.weaponVariants = [{
                id: 0,
                src: "",
                xp: 0,
                val: 1,
            }, {
                id: 1,
                src: "_g",
                xp: 3000,
                val: 1.1,
            }, {
                id: 2,
                src: "_d",
                xp: 7000,
                val: 1.18,
            }, {
                id: 3,
                src: "_r",
                poison: true,
                xp: 12000,
                val: 1.18,
            }, {
                id: 4,
                src: "_e",
                poison: true,
                heal: true,
                xp: 24000,
                val: 1.18,
            }];
            config.anotherVisual = true;
            config.anotherVisualTurn = true;
            config.autobot = false;
            config.useWebGl = false;
            config.resetRender = true;
            function waitTime(timeout) {
                return new Promise((done) => {
                    setTimeout(() => {
                        done();
                    }, timeout);
                });
            }
            let changed = false;
            let botSkts = [];
            let canStore;
            if (typeof (Storage) !== "undefined") {
                canStore = true;
            }
            function saveVal(name, val) {
                if (canStore)
                    localStorage.setItem(name, val);
            }
            function deleteVal(name) {
                if (canStore)
                    localStorage.removeItem(name);
            }
            function getSavedVal(name) {
                if (canStore)
                    return localStorage.getItem(name);
                return null;
            }
            let gC = function(a, b) {
                try {
                    let res = JSON.parse(getSavedVal(a));
                    if (typeof res === "object") {
                        return b;
                    } else {
                        return res;
                    }
                } catch (e) {
                    alert("dieskid");
                    return b;
                }
            };
            function setConfigs() {
                return {
                    AutoUpgrade: true,
                    autoReplace: true,
                    autoPlace: true,
                    autoPush: true,
                    killChat: false,
                    autoBuy: true,
                    showDir: true,
                };
            }
            function setConfigs2() {
                return {
                    StrongHeal: false,
                    InvisMode: false,
                    TrapAim: false,
                    AutoSync: false,
                };
            }
            function setConfigs3() {
                return {
                    AutoInsta: true,
                    WeaponGrinder: false,
                    AutoBullSpam: false,
                    RevInsta: false,
                };
            }
            function setConfigs4() {
                return {
                    RandomDir: true,
                    RenderPl: true,
                    Rainbow: true,
                    ObjHp: true,
                };
            }
            function setConfigs5() {
                return {
                    Visuals: false,
                    Reloads: true,
                    Shame: true,
                    Grid: true,
                    Info: true,
                    Packet: true,
                };
            }
            function setConfigs6() {
                return {
                    AutoClear: true,
                    HatsMenu: true,
                    Tracers: true,
                    Zoom: false,
                };
            }
            let configs = setConfigs();
            let configs2 = setConfigs2();
            let configs3 = setConfigs3();
            let configs4 = setConfigs4();
            let configs5 = setConfigs5();
            let configs6 = setConfigs6();
            window.removeConfigs = function() {
                for (let cF in configs) {
                    deleteVal(cF, configs[cF]);
                }
                for (let cF in configs2) {
                    deleteVal(cF, configs2[cF]);
                }
                for (let cF in configs3) {
                    deleteVal(cF, configs3[cF]);
                }
                for (let cF in configs4) {
                    deleteVal(cF, configs4[cF]);
                }
                for (let cF in configs5) {
                    deleteVal(cF, configs5[cF]);
                }
                for (let cF in configs6) {
                    deleteVal(cF, configs6[cF]);
                }
            };
            for (let cF in configs) {
                configs[cF] = gC(cF, configs[cF]);
            }
            for (let cF in configs2) {
                configs2[cF] = gC(cF, configs2[cF]);
            }
            for (let cF in configs3) {
                configs3[cF] = gC(cF, configs3[cF]);
            }
            for (let cF in configs4) {
                configs4[cF] = gC(cF, configs4[cF]);
            }
            for (let cF in configs5) {
                configs5[cF] = gC(cF, configs5[cF]);
            }
            for (let cF in configs6) {
                configs6[cF] = gC(cF, configs6[cF]);
            }
            window.changeMenu = function() { };
            window.debug = function() { };
            window.toggleNight = function() { };
            window.wasdMode = function() { };
            window.startGrind = function() { };
            window.connectFillBots = function() { };
            window.destroyFillBots = function() { };
            window.tryConnectBots = function() { };
            window.destroyBots = function() { };
            window.resBuild = function() { };
            window.toggleBotsCircle = function() { };
            window.toggleVisual = function() { };
            window.prepareUI = function() { };
            window.leave = function() { };
            window.ping = 0;
            class HtmlAction {
                constructor(element) {
                    this.element = element;
                };
                add(code) {
                    if (!this.element) return undefined;
                    this.element.innerHTML += code;
                };
                newLine(amount) {
                    let result = `<br>`;
                    if (amount > 0) {
                        result = ``;
                        for (let i = 0; i < amount; i++) {
                            result += `<br>`;
                        }
                    }
                    this.add(result);
                };
                checkBox(setting) {
                    let newCheck = `<input type = "checkbox"`;
                    setting.id && (newCheck += ` id = ${setting.id}`);
                    setting.style && (newCheck += ` style = ${setting.style.replaceAll(" ", "")}`);
                    setting.class && (newCheck += ` class = ${setting.class}`);
                    setting.checked && (newCheck += ` checked`);
                    setting.onclick && (newCheck += ` onclick = ${setting.onclick}`);
                    newCheck += `>`;
                    this.add(newCheck);
                };
                text(setting) {
                    let newText = `<input type = "text"`;
                    setting.id && (newText += ` id = ${setting.id}`);
                    setting.style && (newText += ` style = ${setting.style.replaceAll(" ", "")}`);
                    setting.class && (newText += ` class = ${setting.class}`);
                    setting.size && (newText += ` size = ${setting.size}`);
                    setting.maxLength && (newText += ` maxLength = ${setting.maxLength}`);
                    setting.value && (newText += ` value = ${setting.value}`);
                    setting.placeHolder && (newText += ` placeHolder = ${setting.placeHolder.replaceAll(" ", "&nbsp;")}`);
                    newText += `>`;
                    this.add(newText);
                };
                select(setting) {
                    let newSelect = `<select`;
                    setting.id && (newSelect += ` id = ${setting.id}`);
                    setting.style && (newSelect += ` style = ${setting.style.replaceAll(" ", "")}`);
                    setting.class && (newSelect += ` class = ${setting.class}`);
                    newSelect += `>`;
                    for (let options in setting.option) {
                        newSelect += `<option value = ${setting.option[options].id}`
                        setting.option[options].selected && (newSelect += ` selected`);
                        newSelect += `>${options}</option>`;
                    }
                    newSelect += `</select>`;
                    this.add(newSelect);
                };
                button(setting) {
                    let newButton = `<button`;
                    setting.id && (newButton += ` id = ${setting.id}`);
                    setting.style && (newButton += ` style = ${setting.style.replaceAll(" ", "")}`);
                    setting.class && (newButton += ` class = ${setting.class}`);
                    setting.onclick && (newButton += ` onclick = ${setting.onclick}`);
                    newButton += `>`;
                    setting.innerHTML && (newButton += setting.innerHTML);
                    newButton += `</button>`;
                    this.add(newButton);
                };
                selectMenu(setting) {
                    let newSelect = `<select`;
                    if (!setting.id) {
                        alert("please put id skid");
                        return;
                    }
                    window[setting.id + "Func"] = function() { };
                    setting.id && (newSelect += ` id = ${setting.id}`);
                    setting.style && (newSelect += ` style = ${setting.style.replaceAll(" ", "")}`);
                    setting.class && (newSelect += ` class = ${setting.class}`);
                    newSelect += ` onchange = window.${setting.id + "Func"}()`;
                    newSelect += `>`;
                    let last;
                    let i = 0;
                    for (let options in setting.menu) {
                        newSelect += `<option value = ${"option_" + options} id = ${"O_" + options}`;
                        setting.menu[options] && (newSelect += ` checked`);
                        newSelect += ` style = "color: ${setting.menu[options] ? "#000" : "#fff"}; background: ${setting.menu[options] ? "#8ecc51" : "#cc5151"};">${options}</option>`;
                        i++;
                    }
                    newSelect += `</select>`;
                    this.add(newSelect);
                    i = 0;
                    for (let options in setting.menu) {
                        window[options + "Func"] = function() {
                            setting.menu[options] = getEl("check_" + options).checked ? true : false;
                            saveVal(options, setting.menu[options]);
                            getEl("O_" + options).style.color = setting.menu[options] ? "#000" : "#fff";
                            getEl("O_" + options).style.background = setting.menu[options] ? "#8ecc51" : "#cc5151";
                        };
                        this.checkBox({ id: "check_" + options, style: `display: ${i == 0 ? "inline-block" : "none"};`, class: "checkB", onclick: `window.${options + "Func"}()`, checked: setting.menu[options] });
                        i++;
                    }
                    last = "check_" + getEl(setting.id).value.split("_")[1];
                    window[setting.id + "Func"] = function() {
                        getEl(last).style.display = "none";
                        last = "check_" + getEl(setting.id).value.split("_")[1];
                        getEl(last).style.display = "inline-block";
                    };
                };
            };
            class Html {
                constructor() {
                    this.element = null;
                    this.action = null;
                    this.divElement = null;
                    this.startDiv = function(setting, func) {
                        let newDiv = document.createElement("div");
                        setting.id && (newDiv.id = setting.id);
                        setting.style && (newDiv.style = setting.style);
                        setting.class && (newDiv.className = setting.class);
                        this.element.appendChild(newDiv);
                        this.divElement = newDiv;
                        let addRes = new HtmlAction(newDiv);
                        typeof func == "function" && func(addRes);
                    };
                    this.addDiv = function(setting, func) {
                        let newDiv = document.createElement("div");
                        setting.id && (newDiv.id = setting.id);
                        setting.style && (newDiv.style = setting.style);
                        setting.class && (newDiv.className = setting.class);
                        setting.appendID && getEl(setting.appendID).appendChild(newDiv);
                        this.divElement = newDiv;
                        let addRes = new HtmlAction(newDiv);
                        typeof func == "function" && func(addRes);
                    };
                };
                set(id) {
                    this.element = getEl(id);
                    this.action = new HtmlAction(this.element);
                };
                resetHTML(text) {
                    if (text) {
                        this.element.innerHTML = ``;
                    } else {
                        this.element.innerHTML = ``;
                    }
                };
                setStyle(style) {
                    this.element.style = style;
                };
                setCSS(style) {
                    this.action.add(`<style>` + style + `</style>`);
                };
            };

            let overlay = document.createElement('div');
            overlay.id = 'overlay';

            document.body.appendChild(overlay);

            let overlayStyles = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0);
                z-index: 999;
                pointer-events: none;
                transition: background-color 0.5s ease;
            `;

            overlay.setAttribute('style', overlayStyles);

            const parentElement = document.getElementById('topInfoHolder');
            const childElement = document.getElementById('killCounter');

            if (parentElement && childElement) {
                parentElement.removeChild(childElement);
                document.body.appendChild(childElement);
            }
            let HTML = new Html();
            let menuDiv = document.createElement("div");
            menuDiv.id = "menuDiv";
            document.body.appendChild(menuDiv);
            HTML.set("menuDiv");
            HTML.resetHTML();
            HTML.setCSS(`
            .menuClass{
                position: absolute;
                left: 20px;
                top: 20px;
                color: #fff;
                font-size: 31px;
                text-align: left;
                padding: 10px;
                padding-top: 7px;
                opacity: 0;
                padding-bottom: 5px;
                width: 213px;
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                background-color: rgba(34, 34, 34, 0.5);
                border-radius: 4px;
                box-shadow: -5px -5px 15px rgba(255, 255, 255, 0.1),
                5px 5px 15px rgba(0, 0, 0, 0.35);
                transition: all 1s ease-in-out;
                z-index: 1000000;
            }
            .menuClass2{
                position: absolute;
                opacity: 0;
                left: 268px;
                top: 20px;
                color: #fff;
                font-size: 31px;
                text-align: left;
                padding: 10px;
                padding-top: 7px;
                padding-bottom: 5px;
                width: 193px;
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;
                background-color: rgba(34, 34, 34, 0.5);
                box-shadow: -5px -5px 15px rgba(255, 255, 255, 0.1),
                5px 5px 15px rgba(0, 0, 0, 0.35);
                transition: all 1s ease-in-out;
                z-index: 1000000;
            }
            .menuClass3{
                position: absolute;
                background-color: rgba(34, 34, 34, 0.5);
                opacity: 0;
                left: 496px;
                top: 20px;
                color: #fff;
                font-size: 31px;
                text-align: left;
                padding: 10px;
                padding-top: 7px;
                padding-bottom: 5px;
                width: 191px;
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;
                box-shadow: -5px -5px 15px rgba(255, 255, 255, 0.1),
                5px 5px 15px rgba(0, 0, 0, 0.35);
                transition: all 1s ease-in-out;
                z-index: 1000000;
            }
            .menuClass4{
                position: absolute;
                background-color: rgba(34, 34, 34, 0.5);
                opacity: 0;
                left: 724px;
                top: 20px;
                color: #fff;
                font-size: 31px;
                text-align: left;
                padding: 10px;
                padding-top: 7px;
                padding-bottom: 5px;
                width: 220px;
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;
                box-shadow: -5px -5px 15px rgba(255, 255, 255, 0.1),
                5px 5px 15px rgba(0, 0, 0, 0.35);
                transition: all 1s ease-in-out;
                z-index: 1000000;
            }
            .menuClass:hover {
                transform: scale(1.1);
            }
            .menuClass2:hover {
                transform: scale(1.1);
            }
            .menuClass3:hover {
                transform: scale(1.1);
            }
            .menuClass4:hover {
                transform: scale(1.1);
            }
            .menuC {
                color: #fff;
                display: none;
                font-family: "Hammersmith One";
                font-size: 12px;
                height: 125px;
                overflow-y: scroll;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            .menuC2 {
                color: #fff;
                display: block;
                font-family: "Hammersmith One";
                font-size: 12px;
                height: 125px;
                overflow-y: scroll;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            .menuC3 {
                color: #fff;
                display: block;
                font-family: "Hammersmith One";
                font-size: 12px;
                height: 125px;
                overflow-y: scroll;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            .menuC4 {
                color: #fff;
                display: block;
                font-family: "Hammersmith One";
                font-size: 12px;
                height: 125px;
                overflow-y: scroll;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -khtml-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            #storeButton {
               right: 390px;
            }
            #allianceButton {
               right: 330px;
            }
            #leaderboardButton {
                right: 270px;
                display: block;
            }
            #stoneDisplay {
                bottom: 75px;
            }
            #killCounter {
                right: 20px;
            }
            #woodDisplay {
                bottom: 130px;
            }
            #foodDisplay {
                bottom: 185px;
            }
            #scoreDisplay {
                left: inherit;
                right: 20px;
                bottom: 20px;
                text-align: right;
                padding-left: 10px;
                padding-right: 40px;
                background-position: right 6px center;
                background-image: url(../img/resources/gold_ico.png);
            }
            #topInfoHolder {
            }
            .gameButton {
                position: fixed;
            }
            .menuB {
                text-align: center;
                background-color: transparent;
                color: #fff;
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;
                border: 2px solid #000;
                cursor: pointer;
            }
            .menuB:hover {
                border: 2px solid #fff;
            }
            .menuB:active {
                color: rgb(25, 25, 25);
                background-color: rgb(200, 200, 200);
            }
            .customText {
                color: #000;
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;
                border: 2px solid #000;
            }
            .customText:focus {
                background-color: yellow;
            }
            .checkB {
                position: relative;
                top: 2px;
                accent-color: #888;
                cursor: pointer;
            }
            .Cselect {
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 5px;
                background-color: rgb(75, 75, 75, 0.5);
                color: #fff;
                border: 1px solid #000;
            }
            ::-webkit-scrollbar {
                width: 10px;
            }
            ::-webkit-scrollbar-track {
                opacity: 0;
            }
            ::-webkit-scrollbar-thumb {
                background-color: rgb(25, 25, 25);
                -webkit-border-radius: 4px;
                -moz-border-radius: 4px;
                border-radius: 4px;
            }
            ::-webkit-scrollbar-thumb:active {
                background-color: rgb(230, 230, 230);
            }
            `);
            HTML.startDiv({ style: "font-size: 30px; color: #ffffff", id: "menuHeadLine", class: "menuClass" }, (html) => {
                HTML.addDiv({ id: "menuMain", style: "display: block", class: "menuC", appendID: "menuHeadLine" }, (html) => {
                    HTML.addDiv({ style: "font-size: 20px; color: #99ee99; background-image: url('https://images-ext-2.discordapp.net/external/6zOP35kYGLXWXEwO_Lir4edjIqBqDBjl-E0NpmvvCKs/%3Fcb%3D20171206232244/https/static.wikia.nocookie.net/moom/images/e/e3/Hat_47.png/revision/latest/scale-to-width-down/250?format=webp&width=312&height=312'); background-size: 20px 20px; background-repeat: no-repeat; padding-left: 25px;", appendID: "menuMain" }, (html) => {
                        html.add(`InfoCheat: `);
                        html.newLine();
                    });
                    html.add(`Another: `);
                    html.selectMenu({ id: "configsChanger2", class: "Cselect", menu: configs2 });
                    html.newLine();
                    html.add(`Sigma: `);
                    html.selectMenu({ id: "configsChanger3", class: "Cselect", menu: configs3 });
                    html.newLine();
                    html.add(`Configs: `);
                    html.selectMenu({ id: "configsChanger", class: "Cselect", menu: configs });
                    html.newLine();

                });
            });
            HTML.startDiv({ style: "font-size: 30px; color: #ffffff", id: "menuHeadLine4", class: "menuClass4" }, (html) => {
                HTML.addDiv({ id: "menuRender", style: "display: block", class: "menuC4", appendID: "menuHeadLine4" }, (html) => {
                    HTML.addDiv({ style: "font-size: 20px; color: #99ee99; background-image: url('https://media.discordapp.net/attachments/1055504047169347707/1206978817801977916/EdZbgt0pisJYLTgmG9r9hhl_t5lkgTPRx_IinpR47a4.png?ex=65ddf99e&is=65cb849e&hm=115b0cb3ef4fedfa691307a50ae4ae7eb1d559daa8b2f8f69e3c376a7ed56e6d&=&format=webp&quality=lossless&width=320&height=320'); background-size: 20px 20px; background-repeat: no-repeat; padding-left: 25px;", appendID: "menuRender" }, (html) => {
                        html.add(`Render: `);
                        html.newLine();
                    });
                    html.add(`Sync Type: `);
                    html.select({
                        id: "synctype", class: "Cselect", option: {
                            "Long": {
                                id: "longsync",
                            },
                            "Fast": {
                                id: "fastsync",
                            },
                        }
                    });
                    html.newLine();
                    html.add(`Type: `);
                    html.selectMenu({ id: "configsChanger6", class: "Cselect", menu: configs6 });
                    html.newLine(2);
                    HTML.addDiv({ style: "font-size: 17px; color: #fff; background-image: url('https://media.discordapp.net/attachments/1055504047169347707/1207295828151107634/lbnIQzE.png?ex=65df20db&is=65ccabdb&hm=1d81a71c49db6d96d869e1fd36a4c1b8cf61ac9c77f91a8c5f17dd30df59bf7c&=&format=webp&quality=lossless&width=320&height=320'); background-size: 20px 20px; background-repeat: no-repeat; padding-left: 25px;", appendID: "menuRender" }, (html) => {
                        html.add(`Modes: `);
                        html.select({
                            id: "modstype", class: "Cselect", option: {
                                "Permision": {
                                    id: "",
                                },
                            }
                        });
                    });
                });
            });
            HTML.startDiv({ style: "font-size: 30px; color: #ffffff", id: "menuHeadLine2", class: "menuClass2" }, (html) => {
                HTML.addDiv({ id: "menuOther", class: "menuC2", appendID: "menuHeadLine2" }, (html) => {
                    HTML.addDiv({ style: "font-size: 20px; color: #99ee99; background-image: url('https://media.discordapp.net/attachments/1055504047169347707/1206950640421707776/meko_eaten_hat_in_moomoo_io__gift__by_alextox_shatox_dfptbvx-fullview.png?ex=65dddf60&is=65cb6a60&hm=774ca1e9af2b472a9abf99b4ffba727cab694b08111df589a5715337ec5c78ce&=&format=webp&quality=lossless&width=320&height=320'); background-size: 20px 20px; background-repeat: no-repeat; padding-left: 25px;", appendID: "menuOther" }, (html) => {
                        html.add(`Misc: `);
                        html.newLine();
                    });
                    html.newLine();
                    html.add(`Auto Upgrade: `);
                    html.select({
                        id: "autoupDate", class: "Cselect", option: {
                            "Smart": {
                                id: "basic",
                                selected: true
                            },
                            "KH": {
                                id: "khup",
                            },
                            "SM": {
                                id: "smup",
                            },
                        }
                    });
                    html.newLine();
                    html.button({ class: "menuB", innerHTML: "TurnSpeed", onclick: "window.toggleVisualTurn()" });
                    html.button({ class: "menuB", innerHTML: "AutoBot", onclick: "window.AutoBot()" });
                    html.button({ class: "menuB", innerHTML: "Board", onclick: "window.Leaderboard()" });
                    html.newLine(2);
                    HTML.addDiv({ style: "font-size: 17px; color: #fff; background-image: url('https://media.discordapp.net/attachments/1055504047169347707/1208305662212186154/latest.png?ex=65e2cd57&is=65d05857&hm=51ccab99264611a4cdf8c96eeb89a7ee1b632329cdc9d032c01a07f38fbcd977&=&format=webp&quality=lossless&width=320&height=320'); background-size: 20px 20px; background-repeat: no-repeat; padding-left: 25px;", appendID: "menuOther" }, (html) => {
                        html.add(`Defense: `);
                        html.select({
                            id: "defensemode", class: "Cselect", option: {
                                "Emp": {
                                    id: "empmode",
                                    selected: true
                                },
                                "Soldier": {
                                    id: "soldiermode",
                                },
                            }
                        });
                    });
                });
            });
            HTML.startDiv({ style: "font-size: 30px; color: #ffffff", id: "menuHeadLine3", class: "menuClass3" }, (html) => {
                HTML.addDiv({ id: "menuvisual", style: "display: block", class: "menuC3", appendID: "menuHeadLine3" }, (html) => {
                    HTML.addDiv({ style: "font-size: 20px; color: #99ee99; background-image: url('https://media.discordapp.net/attachments/1055504047169347707/1206950045165953084/250.png?ex=65ddded2&is=65cb69d2&hm=a46e062d9d8786074e53ac88733c8376389cd89131f03d44fb74cc840795cf13&=&format=webp&quality=lossless&width=312&height=312'); background-size: 20px 20px; background-repeat: no-repeat; padding-left: 25px;", appendID: "menuvisual" }, (html) => {
                        html.add(`Visuals: `);
                        html.newLine();
                    });
                    html.add(`Time Type: `);
                    html.select({
                        id: "timeType", class: "Cselect", option: {
                            "Morning": {
                                id: "morningt",
                            },
                            "Day": {
                                id: "daytt",
                                selected: true
                            },
                            "AfterNoon": {
                                id: "afternoont",
                            },
                            "Evening": {
                                id: "eveningt",
                            },
                            "Night": {
                                id: "nightt",
                            },
                        }
                    });
                    html.newLine();
                    html.add(`Visual Type: `);
                    html.select({
                        id: "visualType", class: "Cselect", option: {
                            "ae86": {
                                id: "aevisuals",
                                selected: true
                            },
                            "FzBroadCast": {
                                id: "fz",
                            },
                        }
                    });
                    html.newLine();
                    html.add(`Player: `);
                    html.selectMenu({ id: "configsChanger4", class: "Cselect", menu: configs4 });
                    html.newLine();
                    html.add(`Just: `);
                    html.selectMenu({ id: "configsChanger5", class: "Cselect", menu: configs5 });
                    html.newLine();
                });
            });
            let trueM = true;
            let Soldier = 6;
            let AntiBull = false;
            let bultect = false;
            let instaType = true;
            let crossHair = false;
            let plaguemask = true;
            let PrePlaceCount = 0;
            let menuChatDiv = document.createElement("div");
            menuChatDiv.id = "menuChatDiv";
            document.body.appendChild(menuChatDiv);
            HTML.set("menuChatDiv");
            HTML.setStyle(`
            position: absolute;
            display: none;
            left: 20px;
            top: 20px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0);
            `);
            HTML.resetHTML();
            HTML.setCSS(`
            .chDiv {
    color: #fff;
    padding: 10px;
    width: 300px;
    height: 160px;
    background-color: rgba(34, 34, 34, 0.5);
    font-family: "Courier New", monospace;
    border-radius: 15px;
    box-shadow: -5px -5px 15px rgba(255, 255, 255, 0.1),
    5px 5px 15px rgba(0, 0, 0, 0.35);
    transition: all 3s ease-in-out;
}
.chMainDiv {
    font-family: "Ubuntu";
    font-size: 16px;
    max-height: 165px;
    overflow-y: scroll;
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.5) rgba(255, 255, 255, 0.1);
    border-radius: 10px;
}
.chMainDiv::-webkit-scrollbar {
    width: 8px;
}
.chMainDiv::-webkit-scrollbar-thumb {
    background-color: rgba(255, 255, 255, 0.5);
    border-radius: 10px;
}
.chMainDiv::-webkit-scrollbar-thumb:hover {
    background-color: rgba(255, 255, 255, 0.7);
}
.chMainBox {
     position: absolute;
    left: 10px;
    bottom: 10px;
    width: 380px;
    height: 25px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    color: rgba(255, 255, 255, 0.75);
    font-family: "Courier New", monospace;
    font-size: 12px;
    border: none;
    outline: none;
}
            `);
            HTML.startDiv({ id: "mChDiv", class: "chDiv" }, (html) => {
                HTML.addDiv({ id: "mChMain", class: "chMainDiv", appendID: "mChDiv" }, (html) => {
                });
            });
            let menuChats = getEl("mChMain");
            let menuCBFocus = false;
            let menuChCounts = 0;

            function addChatLog(e, c, d, v) {
                HTML.set("menuChatDiv");
                let chatLogs = document.getElementById("mChMain");
                const now = new Date();
                const hours = now.getHours();
                const minutes = now.getMinutes();
                const ampm = hours >= 12 ? 'PM' : 'AM';
                const formattedHours = (hours % 12 || 12).toString();
                const formattedMinutes = minutes.toString().padStart(2, '0');
                let time = `${formattedHours}:${formattedMinutes} ${ampm}`;

                let a = document.createElement('div');
                a.className = 'chatEntry';

                let timeSpan = document.createElement('span');
                timeSpan.style.color = 'rgba(255, 255, 255, 0.5)';
                timeSpan.innerText = `${time}`;
                a.appendChild(timeSpan);

                let namething = document.createElement('span');
                namething.style.color = v;
                namething.innerText = ' ' + d;
                a.appendChild(namething);

                let chatSpan = document.createElement('span');
                chatSpan.style.color = c;
                chatSpan.innerText = ' ' + e;
                a.appendChild(chatSpan);

                chatLogs.appendChild(a);
                chatLogs.scrollTop = chatLogs.scrollHeight;
            }
            let mStatus = document.createElement("div");
            mStatus.id = "status";
            getEl("gameUI").appendChild(mStatus);
            HTML.set("status");
            HTML.resetHTML();
            HTML.setCSS(`
            .sizing {
                font-size: 15px;
                display: block;
                position: absolute;
                color: #ddd;
                font-family: 'Hammersmith One';
                bottom: 155px;
                left: 20px;
            }
            .sizingTime {
                font-size: 15px;
                display: block;
                position: absolute;
                color: #ddd;
                font-family: 'Hammersmith One';
                top: 77px;
                right: 270px;
            }
            .sizingInfo {
                font-size: 15px;
                display: block;
                position: absolute;
                color: #ddd;
                font-family: 'Hammersmith One', sans-serif;
                bottom: 168px;
                right: 20px;
                background-color: rgba(0, 0, 0, 0.25);
                padding: 5px;
                border-radius: 4px;
            }
            .sizingInfo2 {
                font-size: 15px;
                display: block;
                position: absolute;
                color: #ddd;
                font-family: 'Hammersmith One', sans-serif;
                bottom: 130px;
                right: 20px;
                background-color: rgba(0, 0, 0, 0.25);
                padding: 5px;
                border-radius: 4px;
            }
            .mod {
                font-size: 15px;
                display: inline-block;
            }
            .modTime {
                font-size: 15px;
                display: inline-block;
            }
            .modInfo {
                font-size: 15px;
                display: inline-block;
            }
            .modInfo2 {
                font-size: 15px;
                display: inline-block;
            }
            `);
            HTML.startDiv({ id: "happymodTime", class: "sizingTime" }, (html) => {
                HTML.addDiv({ id: "Time", class: "modInfo", appendID: "happymodTime" }, (html) => {
                });
            });
            HTML.startDiv({ id: "happymodInfo", class: "sizingInfo" }, (html) => {
                HTML.addDiv({ id: "InfoAll", class: "modInfo", appendID: "happymodInfo" }, (html) => {
                });
            });
            HTML.startDiv({ id: "happymodInfo2", class: "sizingInfo2" }, (html) => {
                HTML.addDiv({ id: "fpstimer", class: "modInfo2", appendID: "happymodInfo2" }, (html) => {
                });
            });
            HTML.startDiv({ id: "happymod", class: "sizing" }, (html) => {
                HTML.addDiv({ id: "Music", class: "mod", appendID: "happymod" }, (html) => {
                });
                html.newLine();
                HTML.addDiv({ id: "pingFps", class: "mod", appendID: "happymod" }, (html) => {
                });
                html.newLine();
                HTML.addDiv({ id: "packetStatus", class: "mod", appendID: "happymod" }, (html) => {
                    html.add("None");
                });
            });
            let openMenu = false;
            let WS = undefined;
            let socketID = undefined;
            let secPacket = 0;
            let secMax = 110;
            let secTime = 1000;
            let firstSend = {
                sec: false
            };
            let game = {
                tick: 0,
                tickQueue: [],
                tickBase: function(set, tick) {
                    if (this.tickQueue[this.tick + tick]) {
                        this.tickQueue[this.tick + tick].push(set);
                    } else {
                        this.tickQueue[this.tick + tick] = [set];
                    }
                },
                tickRate: (1000 / config.serverUpdateRate),
                tickSpeed: 0,
                lastTick: performance.now()
            };
            setInterval(() => {
                secPacket = 0;
            }, 1000);
            let modConsole = [];
            let dontSend = false;
            let fpsTimer = {
                last: 0,
                time: 0,
                ltime: 0
            }
            let lastMoveDir = undefined;
            let lastsp = ["cc", 1, "__proto__"];
            WebSocket.prototype.nsend = WebSocket.prototype.send;
            WebSocket.prototype.send = function(message) {
                if (!WS) {
                    WS = this;
                    WS.addEventListener("message", function(msg) {
                        getMessage(msg);
                    });
                    WS.addEventListener("close", (event) => {
                        if (event.code == 4001) {
                            window.location.reload();
                        }
                    });
                }
                if (WS == this) {
                    dontSend = false;
                    let data = new Uint8Array(message);
                    let parsed = window.msgpack.decode(data);
                    let type = parsed[0];
                    data = parsed[1];
                    if (type == "6") {
                        if (data[0]) {
                            let tmpString;
                            data[0] = data[0].slice(0, 30);
                        }
                    } else if (type == "L") {
                        data[0] = data[0] + (String.fromCharCode(0).repeat(7));
                        data[0] = data[0].slice(0, 7);
                    } else if (type == "M") {
                        data[0].name = (data[0].name == "" ? "unknown" : data[0].name);
                        data[0].moofoll = true;
                        data[0].skin = data[0].skin == 10 ? "__proto__" : data[0].skin;
                        lastsp = [data[0].name, data[0].moofoll, data[0].skin];
                    } else if (type == "D") {
                        if ((my.lastDir == data[0]) || [null, undefined].includes(data[0])) {
                            dontSend = true;
                        } else {
                            my.lastDir = data[0];
                        }
                    } else if (type == "d") {
                        if (!data[2]) {
                            dontSend = true;
                        } else {
                            if (![null, undefined].includes(data[1])) {
                                my.lastDir = data[1];
                            }
                        }
                    } else if (type == "K") {
                        if (!data[1]) {
                            dontSend = true;
                        }
                    } else if (type == "S") {
                        instaC.wait = !instaC.wait;
                        dontSend = true;
                    } else if (type == "a") {
                        if (data[1]) {
                            if (player.moveDir == data[0]) {
                                dontSend = true;
                                player.randDIff = Math.random * Math.PI * 2;
                            }
                            player.moveDir = data[0];
                        } else {
                            dontSend = true;
                        }
                    }
                    if (!dontSend) {
                        let binary = window.msgpack.encode([type, data]);
                        this.nsend(binary);
                        if (!firstSend.sec) {
                            firstSend.sec = true;
                            setTimeout(() => {
                                firstSend.sec = false;
                                secPacket = 0;
                            }, secTime);
                        }
                        secPacket++;
                    }
                } else {
                    this.nsend(message);
                }
            }
            function packet(type) {
                let data = Array.prototype.slice.call(arguments, 1);
                let binary = window.msgpack.encode([type, data]);
                WS.send(binary);
            }
            function origPacket(type) {
                let data = Array.prototype.slice.call(arguments, 1);
                let binary = window.msgpack.encode([type, data]);
                WS.nsend(binary);
            }
            window.leave = function() {
                origPacket("kys", {
                    "frvr is so bad": true,
                    "sidney is too good": true,
                    "dev are too weak": true,
                });
            };
            let io = {
                send: packet
            };
            function getMessage(message) {
                let data = new Uint8Array(message.data);
                let parsed = window.msgpack.decode(data);
                let type = parsed[0];
                data = parsed[1];
                let events = {
                    A: setInitData,
                    C: setupGame,
                    D: addPlayer,
                    E: removePlayer,
                    a: updatePlayers,
                    G: updateLeaderboard,
                    H: loadGameObject,
                    I: loadAI,
                    J: animateAI,
                    K: gatherAnimation,
                    L: wiggleGameObject,
                    M: shootTurret,
                    N: updatePlayerValue,
                    O: updateHealth,
                    P: killPlayer,
                    Q: killObject,
                    R: killObjects,
                    S: updateItemCounts,
                    T: updateAge,
                    U: updateUpgrades,
                    V: updateItems,
                    X: addProjectile,
                    Y: remProjectile,
                    2: allianceNotification,
                    3: setPlayerTeam,
                    4: setAlliancePlayers,
                    5: updateStoreItems,
                    6: receiveChat,
                    7: updateMinimap,
                    8: showText,
                    9: pingMap,
                    0: pingSocketResponse,
                };
                if (type == "io-init") {
                    socketID = data[0];
                } else {
                    if (events[type]) {
                        events[type].apply(undefined, data);
                    }
                }
            }
            Math.lerpAngle = function(value1, value2, amount) {
                let difference = Math.abs(value2 - value1);
                if (difference > Math.PI) {
                    if (value1 > value2) {
                        value2 += Math.PI * 2;
                    } else {
                        value1 += Math.PI * 2;
                    }
                }
                let value = value2 + ((value1 - value2) * amount);
                if (value >= 0 && value <= Math.PI * 2) return value;
                return value % (Math.PI * 2);
            };
            CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
                if (w < 2 * r) r = w / 2;
                if (h < 2 * r) r = h / 2;
                if (r < 0)
                    r = 0;
                this.beginPath();
                this.moveTo(x + r, y);
                this.arcTo(x + w, y, x + w, y + h, r);
                this.arcTo(x + w, y + h, x, y + h, r);
                this.arcTo(x, y + h, x, y, r);
                this.arcTo(x, y, x + w, y, r);
                this.closePath();
                return this;
            };
            let allChats = [];
            let ais = [];
            let players = [];
            let alliances = [];
            let alliancePlayers = [];
            let allianceNotifications = [];
            let gameObjects = [];
            let projectiles = [];
            let deadPlayers = [];
            let breakObjects = [];
            let player;
            let playerSID;
            let tmpObj;
            let enemy = [];
            let nears = [];
            let near = [];
            let my = {
                reloaded: false,
                waitHit: 0,
                autoAim: false,
                revAim: false,
                ageInsta: true,
                reSync: false,
                bullTick: 0,
                anti0Tick: 0,
                antiSync: false,
                safePrimary: function(tmpObj) {
                    return [0, 8].includes(tmpObj.primaryIndex);
                },
                safeSecondary: function(tmpObj) {
                    return [10, 11, 14].includes(tmpObj.secondaryIndex);
                },
                lastDir: 0,
                autoPush: false,
                pushData: {}
            }

            function findID(tmpObj, tmp) {
                return tmpObj.find((THIS) => THIS.id == tmp);
            }
            function findSID(tmpObj, tmp) {
                return tmpObj.find((THIS) => THIS.sid == tmp);
            }
            function findPlayerByID(id) {
                return findID(players, id);
            }
            function findPlayerBySID(sid) {
                return findSID(players, sid);
            }
            function findAIBySID(sid) {
                return findSID(ais, sid);
            }
            function findObjectBySid(sid) {
                return findSID(gameObjects, sid);
            }
            function findProjectileBySid(sid) {
                return findSID(gameObjects, sid);
            }

            let adCard = getEl("adCard");
            adCard.remove();
            let promoImageHolder = getEl("promoImgHolder");
            let chatButton = getEl("chatButton");
            let gameCanvas = getEl("gameCanvas");
            let mainContext = gameCanvas.getContext("2d");
            let mapDisplay = getEl("mapDisplay");
            let mapContext = mapDisplay.getContext("2d");
            mapDisplay.width = 300;
            mapDisplay.height = 300;
            let storeMenu = getEl("storeMenu");
            let storeHolder = getEl("storeHolder");
            let upgradeHolder = getEl("upgradeHolder");
            let upgradeCounter = getEl("upgradeCounter");
            let chatBox = getEl("chatBox");
            chatBox.autocomplete = "off";
            chatBox.style.textAlign = "center";
            chatBox.style.width = "18em";
            let chatHolder = getEl("chatHolder");
            let actionBar = getEl("actionBar");
            let leaderboardData = getEl("leaderboardData");
            let itemInfoHolder = getEl("itemInfoHolder");
            let menuCardHolder = getEl("menuCardHolder");
            let mainMenu = getEl("mainMenu");
            let diedText = getEl("diedText");
            let screenWidth;
            let screenHeight;
            let maxScreenWidth = config.maxScreenWidth;
            let maxScreenHeight = config.maxScreenHeight;
            maxScreenHeight = config.maxScreenHeight;
            maxScreenWidth = config.maxScreenWidth;
            function zoomVision() {
                if (maxScreenWidth != config.maxScreenWidth * 1.0 || maxScreenHeight != config.maxScreenHeight * 1.0) {
                    maxScreenWidth = config.maxScreenWidth * 1.0;
                    maxScreenHeight = config.maxScreenHeight * 1.0;
                    resize();
                }
            }
            let pixelDensity = 1;
            let delta;
            let now;
            let lastUpdate = performance.now();
            let camX;
            let camY;
            let tmpDir;
            let mouseX = 0;
            let mouseY = 0;
            let allianceMenu = getEl("allianceMenu");
            let waterMult = 1;
            let waterPlus = 0;
            let outlineColor = "#525252";
            let darkOutlineColor = "#3d3f42";
            let outlineWidth = 5.5;
            let outlineWidthRender = 4.5;
            let outlineColorRender = "#525252";
            let isNight = false;
            let firstSetup = true;
            let keys = {};
            let moveKeys = {
                87: [0, -1],
                38: [0, -1],
                83: [0, 1],
                40: [0, 1],
                65: [-1, 0],
                37: [-1, 0],
                68: [1, 0],
                39: [1, 0],
            };
            function resetMoveDir() {
                keys = {};
                io.send("e");
            }
            let attackState = 0;
            let inGame = false;
            let macro = {};
            let mills = {
                place: 0,
                placeSpawnPads: 0
            };
            let lastDir;
            let lastLeaderboardData = [];
            let inWindow = true;
            window.onblur = function() {
                inWindow = false;
            };
            window.onfocus = function() {
                inWindow = true;
                if (player && player.alive) {
                    resetMoveDir();
                }
            };
            let placeVisible = [];
            let profanityList = ["cunt", "whore", "fuck", "shit", "faggot", "nigger",
                                 "nigga", "dick", "vagina", "minge", "cock", "rape", "cum", "sex",
                                 "tits", "penis", "clit", "pussy", "meatcurtain", "jizz", "prune",
                                 "douche", "wanker", "damn", "bitch", "dick", "fag", "bastard"];
            class Utils {
                constructor() {
                    let mathABS = Math.abs,
                        mathCOS = Math.cos,
                        mathSIN = Math.sin,
                        mathPOW = Math.pow,
                        mathSQRT = Math.sqrt,
                        mathATAN2 = Math.atan2,
                        mathPI = Math.PI;
                    let _this = this;
                    this.round = function(n, v) {
                        return Math.round(n * v) / v;
                    };
                    this.toRad = function(angle) {
                        return angle * (mathPI / 180);
                    };
                    this.toAng = function(radian) {
                        return radian / (mathPI / 180);
                    };
                    this.randInt = function(min, max) {
                        return Math.floor(Math.random() * (max - min + 1)) + min;
                    };
                    this.randFloat = function(min, max) {
                        return Math.random() * (max - min + 1) + min;
                    };
                    this.lerp = function(value1, value2, amount) {
                        return value1 + (value2 - value1) * amount;
                    };
                    this.decel = function(val, cel) {
                        if (val > 0)
                            val = Math.max(0, val - cel);
                        else if (val < 0)
                            val = Math.min(0, val + cel);
                        return val;
                    };
                    this.getDistance = function(x1, y1, x2, y2) {
                        return mathSQRT((x2 -= x1) * x2 + (y2 -= y1) * y2);
                    };
                    this.getDist = function(tmp1, tmp2, type1, type2) {
                        let tmpXY1 = {
                            x: type1 == 0 ? tmp1.x : type1 == 1 ? tmp1.x1 : type1 == 2 ? tmp1.x2 : type1 == 3 && tmp1.x3,
                            y: type1 == 0 ? tmp1.y : type1 == 1 ? tmp1.y1 : type1 == 2 ? tmp1.y2 : type1 == 3 && tmp1.y3,
                        };
                        let tmpXY2 = {
                            x: type2 == 0 ? tmp2.x : type2 == 1 ? tmp2.x1 : type2 == 2 ? tmp2.x2 : type2 == 3 && tmp2.x3,
                            y: type2 == 0 ? tmp2.y : type2 == 1 ? tmp2.y1 : type2 == 2 ? tmp2.y2 : type2 == 3 && tmp2.y3,
                        };
                        return mathSQRT((tmpXY2.x -= tmpXY1.x) * tmpXY2.x + (tmpXY2.y -= tmpXY1.y) * tmpXY2.y);
                    };
                    this.getDirection = function(x1, y1, x2, y2) {
                        return mathATAN2(y1 - y2, x1 - x2);
                    };
                    this.getDirect = function(tmp1, tmp2, type1, type2) {
                        let tmpXY1 = {
                            x: type1 == 0 ? tmp1.x : type1 == 1 ? tmp1.x1 : type1 == 2 ? tmp1.x2 : type1 == 3 && tmp1.x3,
                            y: type1 == 0 ? tmp1.y : type1 == 1 ? tmp1.y1 : type1 == 2 ? tmp1.y2 : type1 == 3 && tmp1.y3,
                        };
                        let tmpXY2 = {
                            x: type2 == 0 ? tmp2.x : type2 == 1 ? tmp2.x1 : type2 == 2 ? tmp2.x2 : type2 == 3 && tmp2.x3,
                            y: type2 == 0 ? tmp2.y : type2 == 1 ? tmp2.y1 : type2 == 2 ? tmp2.y2 : type2 == 3 && tmp2.y3,
                        };
                        return mathATAN2(tmpXY1.y - tmpXY2.y, tmpXY1.x - tmpXY2.x);
                    };
                    this.getAngleDist = function(a, b) {
                        let p = mathABS(b - a) % (mathPI * 2);
                        return (p > mathPI ? (mathPI * 2) - p : p);
                    };
                    this.isNumber = function(n) {
                        return (typeof n == "number" && !isNaN(n) && isFinite(n));
                    };
                    this.isString = function(s) {
                        return (s && typeof s == "string");
                    };
                    this.kFormat = function(num) {
                        return num > 999 ? (num / 1000).toFixed(1) + "k" : num;
                    };
                    this.sFormat = function(num) {
                        let fixs = [
                            { num: 1e3, string: "k" },
                            { num: 1e6, string: "m" },
                            { num: 1e9, string: "b" },
                            { num: 1e12, string: "q" }
                        ].reverse();
                        let sp = fixs.find(v => num >= v.num);
                        if (!sp) return num;
                        return (num / sp.num).toFixed(1) + sp.string;
                    };
                    this.capitalizeFirst = function(string) {
                        return string.charAt(0).toUpperCase() + string.slice(1);
                    };
                    this.fixTo = function(n, v) {
                        return parseFloat(n.toFixed(v));
                    };
                    this.sortByPoints = function(a, b) {
                        return parseFloat(b.points) - parseFloat(a.points);
                    };
                    this.lineInRect = function(recX, recY, recX2, recY2, x1, y1, x2, y2) {
                        let minX = x1;
                        let maxX = x2;
                        if (x1 > x2) {
                            minX = x2;
                            maxX = x1;
                        }
                        if (maxX > recX2)
                            maxX = recX2;
                        if (minX < recX)
                            minX = recX;
                        if (minX > maxX)
                            return false;
                        let minY = y1;
                        let maxY = y2;
                        let dx = x2 - x1;
                        if (Math.abs(dx) > 0.0000001) {
                            let a = (y2 - y1) / dx;
                            let b = y1 - a * x1;
                            minY = a * minX + b;
                            maxY = a * maxX + b;
                        }
                        if (minY > maxY) {
                            let tmp = maxY;
                            maxY = minY;
                            minY = tmp;
                        }
                        if (maxY > recY2)
                            maxY = recY2;
                        if (minY < recY)
                            minY = recY;
                        if (minY > maxY)
                            return false;
                        return true;
                    };
                    this.containsPoint = function(element, x, y) {
                        let bounds = element.getBoundingClientRect();
                        let left = bounds.left + window.scrollX;
                        let top = bounds.top + window.scrollY;
                        let width = bounds.width;
                        let height = bounds.height;
                        let insideHorizontal = x > left && x < left + width;
                        let insideVertical = y > top && y < top + height;
                        return insideHorizontal && insideVertical;
                    };
                    this.mousifyTouchEvent = function(event) {
                        let touch = event.changedTouches[0];
                        event.screenX = touch.screenX;
                        event.screenY = touch.screenY;
                        event.clientX = touch.clientX;
                        event.clientY = touch.clientY;
                        event.pageX = touch.pageX;
                        event.pageY = touch.pageY;
                    };
                    this.hookTouchEvents = function(element, skipPrevent) {
                        let preventDefault = !skipPrevent;
                        let isHovering = false;
                        let passive = false;
                        element.addEventListener("touchstart", this.checkTrusted(touchStart), passive);
                        element.addEventListener("touchmove", this.checkTrusted(touchMove), passive);
                        element.addEventListener("touchend", this.checkTrusted(touchEnd), passive);
                        element.addEventListener("touchcancel", this.checkTrusted(touchEnd), passive);
                        element.addEventListener("touchleave", this.checkTrusted(touchEnd), passive);
                        function touchStart(e) {
                            _this.mousifyTouchEvent(e);
                            window.setUsingTouch(true);
                            if (preventDefault) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                            if (element.onmouseover)
                                element.onmouseover(e);
                            isHovering = true;
                        }
                        function touchMove(e) {
                            _this.mousifyTouchEvent(e);
                            window.setUsingTouch(true);
                            if (preventDefault) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                            if (_this.containsPoint(element, e.pageX, e.pageY)) {
                                if (!isHovering) {
                                    if (element.onmouseover)
                                        element.onmouseover(e);
                                    isHovering = true;
                                }
                            } else {
                                if (isHovering) {
                                    if (element.onmouseout)
                                        element.onmouseout(e);
                                    isHovering = false;
                                }
                            }
                        }
                        function touchEnd(e) {
                            _this.mousifyTouchEvent(e);
                            window.setUsingTouch(true);
                            if (preventDefault) {
                                e.preventDefault();
                                e.stopPropagation();
                            }
                            if (isHovering) {
                                if (element.onclick)
                                    element.onclick(e);
                                if (element.onmouseout)
                                    element.onmouseout(e);
                                isHovering = false;
                            }
                        }
                    };
                    this.removeAllChildren = function(element) {
                        while (element.hasChildNodes()) {
                            element.removeChild(element.lastChild);
                        }
                    };
                    this.generateElement = function(config) {
                        let element = document.createElement(config.tag || "div");
                        function bind(configValue, elementValue) {
                            if (config[configValue])
                                element[elementValue] = config[configValue];
                        }
                        bind("text", "textContent");
                        bind("html", "innerHTML");
                        bind("class", "className");
                        for (let key in config) {
                            switch (key) {
                                case "tag":
                                case "text":
                                case "html":
                                case "class":
                                case "style":
                                case "hookTouch":
                                case "parent":
                                case "children":
                                    continue;
                                default:
                                    break;
                            }
                            element[key] = config[key];
                        }
                        if (element.onclick)
                            element.onclick = this.checkTrusted(element.onclick);
                        if (element.onmouseover)
                            element.onmouseover = this.checkTrusted(element.onmouseover);
                        if (element.onmouseout)
                            element.onmouseout = this.checkTrusted(element.onmouseout);
                        if (config.style) {
                            element.style.cssText = config.style;
                        }
                        if (config.hookTouch) {
                            this.hookTouchEvents(element);
                        }
                        if (config.parent) {
                            config.parent.appendChild(element);
                        }
                        if (config.children) {
                            for (let i = 0; i < config.children.length; i++) {
                                element.appendChild(config.children[i]);
                            }
                        }
                        return element;
                    };
                    this.checkTrusted = function(callback) {
                        return function(ev) {
                            if (ev && ev instanceof Event && (ev && typeof ev.isTrusted == "boolean" ? ev.isTrusted : true)) {
                                callback(ev);
                            }
                        };
                    };
                    this.randomString = function(length) {
                        let text = "";
                        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        for (let i = 0; i < length; i++) {
                            text += possible.charAt(Math.floor(Math.random() * possible.length));
                        }
                        return text;
                    };
                    this.countInArray = function(array, val) {
                        let count = 0;
                        for (let i = 0; i < array.length; i++) {
                            if (array[i] === val) count++;
                        }
                        return count;
                    };
                    this.hexToRgb = function(hex) {
                        return hex.slice(1).match(/.{1,2}/g).map(g => parseInt(g, 16));
                    };
                    this.getRgb = function(r, g, b) {
                        return [r / 255, g / 255, b / 255].join(", ");
                    };
                }
            };
            class Animtext {
                constructor() {
                    this.init = function(x, y, scale, speed, life, text, color) {
                        this.x = x;
                        this.y = y;
                        this.color = color;
                        this.scale = scale;
                        this.startScale = this.scale;
                        this.maxScale = scale * 1.0;
                        this.scaleSpeed = 0.7;
                        this.speed = speed;
                        this.life = life;
                        this.text = text;
                    };

                    this.update = function(delta) {
                        if (this.life) {
                            this.life -= delta;
                            this.y -= this.speed * delta;
                            this.scale += this.scaleSpeed * delta;
                            if (this.scale >= this.maxScale) {
                                this.scale = this.maxScale;
                                this.scaleSpeed *= -1;
                            } else if (this.scale <= this.startScale) {
                                this.scale = this.startScale;
                                this.scaleSpeed = 0;
                            }
                            if (this.life <= 0) {
                                this.life = 0;
                            }
                        }
                    };

                    this.render = function(ctxt, xOff, yOff) {
                        ctxt.lineWidth = 10;
                        ctxt.fillStyle = this.color;
                        ctxt.font = this.scale + "px " + (config.anotherVisual ? "Hammersmith One" : "Ubuntu");
                        if (config.anotherVisual) {
                            ctxt.globalAlpha = this.alpha;
                            ctxt.strokeStyle = darkOutlineColor;
                            ctxt.strokeText(this.text, this.x - xOff, this.y - yOff);
                        }
                        ctxt.fillText(this.text, this.x - xOff, this.y - yOff);
                        ctxt.globalAlpha = 1;
                    };
                }
            };
            class Textmanager {
                constructor() {
                    this.texts = [];
                    this.stack = [];
                    this.update = function(delta, ctxt, xOff, yOff) {
                        ctxt.textBaseline = "middle";
                        ctxt.textAlign = "center";
                        for (let i = 0; i < this.texts.length; ++i) {
                            if (this.texts[i].life) {
                                this.texts[i].update(delta);
                                this.texts[i].render(ctxt, xOff, yOff);
                            }
                        }
                    };
                    this.showText = function(x, y, scale, speed, life, text, color) {
                        let tmpText;
                        for (let i = 0; i < this.texts.length; ++i) {
                            if (!this.texts[i].life) {
                                tmpText = this.texts[i];
                                break;
                            }
                        }
                        if (!tmpText) {
                            tmpText = new Animtext();
                            this.texts.push(tmpText);
                        }
                        tmpText.init(x, y, scale, speed, life, text, color);
                    };
                }
            }
            class GameObject {
                constructor(sid) {
                    this.sid = sid;
                    this.init = function(x, y, dir, scale, type, data, owner) {
                        data = data || {};
                        this.sentTo = {};
                        this.gridLocations = [];
                        this.active = true;
                        this.alive = true;
                        this.doUpdate = data.doUpdate;
                        this.x = x;
                        this.y = y;
                        if (config.anotherVisual) {
                            this.dir = dir + Math.PI;
                        } else {
                            this.dir = dir;
                        }
                        this.lastDir = dir;
                        this.xWiggle = 0;
                        this.yWiggle = 0;
                        this.visScale = scale;
                        this.scale = scale;
                        this.type = type;
                        this.id = data.id;
                        this.owner = owner;
                        this.name = data.name;
                        this.isItem = (this.id != undefined);
                        this.group = data.group;
                        this.maxHealth = data.health;
                        this.health = this.maxHealth;
                        this.healthMov = 100;
                        this.layer = 2;
                        if (this.group != undefined) {
                            this.layer = this.group.layer;
                        } else if (this.type == 0) {
                            this.layer = 3;
                        } else if (this.type == 2) {
                            this.layer = 0;
                        } else if (this.type == 4) {
                            this.layer = -1;
                        }
                        this.colDiv = data.colDiv || 1;
                        this.blocker = data.blocker;
                        this.ignoreCollision = data.ignoreCollision;
                        this.dontGather = data.dontGather;
                        this.hideFromEnemy = data.hideFromEnemy;
                        this.friction = data.friction;
                        this.projDmg = data.projDmg;
                        this.dmg = data.dmg;
                        this.pDmg = data.pDmg;
                        this.pps = data.pps;
                        this.zIndex = data.zIndex || 0;
                        this.turnSpeed = data.turnSpeed;
                        this.req = data.req;
                        this.trap = data.trap;
                        this.healCol = data.healCol;
                        this.teleport = data.teleport;
                        this.boostSpeed = data.boostSpeed;
                        this.projectile = data.projectile;
                        this.shootRange = data.shootRange;
                        this.shootRate = data.shootRate;
                        this.shootCount = this.shootRate;
                        this.spawnPoint = data.spawnPoint;
                        this.onNear = 0;
                        this.breakObj = false;
                        this.alpha = data.alpha || 1;
                        this.maxAlpha = data.alpha || 1;
                        this.damaged = 0;
                    };
                    this.changeHealth = function(amount, doer) {
                        this.health += amount;
                        return (this.health <= 0);
                    };
                    this.getScale = function(sM, ig) {
                        sM = sM || 1;
                        return this.scale * ((this.isItem || this.type == 2 || this.type == 3 || this.type == 4) ?
                                             1 : (0.6 * sM)) * (ig ? 1 : this.colDiv);
                    };
                    this.visibleToPlayer = function(player) {
                        return !(this.hideFromEnemy) || (this.owner && (this.owner == player ||
                                                                        (this.owner.team && player.team == this.owner.team)));
                    };
                    this.update = function(delta) {
                        if (this.health != this.healthMov) {
                            this.health < this.healthMov ? (this.healthMov -= 1.9) : (this.healthMov += 1.9);
                            if (Math.abs(this.health - this.healthMov) < 1.9) this.healthMov = this.health;
                        };
                        if (this.active) {
                            if (this.xWiggle) {
                                this.xWiggle *= Math.pow(0.99, delta);
                            }
                            if (this.yWiggle) {
                                this.yWiggle *= Math.pow(0.99, delta);
                            }
                            if (config.anotherVisualTurn) {
                                let d2 = UTILS.getAngleDist(this.lastDir, this.dir);
                                if (d2 > 0.01) {
                                    this.dir += d2 / 5;
                                } else {
                                    this.dir = this.lastDir;
                                }
                            } else {
                                if (this.turnSpeed/* && this.dmg*/) {
                                    this.dir += this.turnSpeed * delta;
                                }
                            }
                        } else {
                            if (this.alive) {
                                this.alpha -= delta / (200 / this.maxAlpha);
                                this.visScale += delta / (this.scale / 2.5);
                                if (this.alpha <= 0) {
                                    this.alpha = 0;
                                    this.alive = false;
                                }
                            }
                        }
                    };
                    this.isTeamObject = function(tmpObj) {
                        return this.owner == null ? true : (this.owner && tmpObj.sid == this.owner.sid || tmpObj.findAllianceBySid(this.owner.sid));
                    };
                }
            }
            class Items {
                constructor() {
                    this.groups = [{
                        id: 0,
                        name: "food",
                        layer: 0
                    }, {
                        id: 1,
                        name: "walls",
                        place: true,
                        limit: 30,
                        layer: 0
                    }, {
                        id: 2,
                        name: "spikes",
                        place: true,
                        limit: 15,
                        layer: 0
                    }, {
                        id: 3,
                        name: "mill",
                        place: true,
                        limit: 7,
                        layer: 1
                    }, {
                        id: 4,
                        name: "mine",
                        place: true,
                        limit: 1,
                        layer: 0
                    }, {
                        id: 5,
                        name: "trap",
                        place: true,
                        limit: 6,
                        layer: -1
                    }, {
                        id: 6,
                        name: "booster",
                        place: true,
                        limit: 12,
                        layer: -1
                    }, {
                        id: 7,
                        name: "turret",
                        place: true,
                        limit: 2,
                        layer: 1
                    }, {
                        id: 8,
                        name: "watchtower",
                        place: true,
                        limit: 12,
                        layer: 1
                    }, {
                        id: 9,
                        name: "buff",
                        place: true,
                        limit: 4,
                        layer: -1
                    }, {
                        id: 10,
                        name: "spawn",
                        place: true,
                        limit: 1,
                        layer: -1
                    }, {
                        id: 11,
                        name: "sapling",
                        place: true,
                        limit: 2,
                        layer: 0
                    }, {
                        id: 12,
                        name: "blocker",
                        place: true,
                        limit: 3,
                        layer: -1
                    }, {
                        id: 13,
                        name: "teleporter",
                        place: true,
                        limit: 2,
                        layer: -1
                    }];
                    this.projectiles = [{
                        indx: 0,
                        layer: 0,
                        src: "arrow_1",
                        dmg: 25,
                        speed: 1.6,
                        scale: 103,
                        range: 1000
                    }, {
                        indx: 1,
                        layer: 1,
                        dmg: 25,
                        scale: 20
                    }, {
                        indx: 0,
                        layer: 0,
                        src: "arrow_1",
                        dmg: 35,
                        speed: 2.5,
                        scale: 103,
                        range: 1200
                    }, {
                        indx: 0,
                        layer: 0,
                        src: "arrow_1",
                        dmg: 30,
                        speed: 2,
                        scale: 103,
                        range: 1200
                    }, {
                        indx: 1,
                        layer: 1,
                        dmg: 16,
                        scale: 20
                    }, {
                        indx: 0,
                        layer: 0,
                        src: "bullet_1",
                        dmg: 50,
                        speed: 3.6,
                        scale: 160,
                        range: 1400
                    }];
                    this.weapons = [{
                        id: 0,
                        type: 0,
                        name: "tool hammer",
                        desc: "tool for gathering all resources",
                        src: "hammer_1",
                        length: 140,
                        width: 140,
                        xOff: -3,
                        yOff: 18,
                        dmg: 25,
                        range: 65,
                        gather: 1,
                        speed: 300
                    }, {
                        id: 1,
                        type: 0,
                        age: 2,
                        name: "hand axe",
                        desc: "gathers resources at a higher rate",
                        src: "axe_1",
                        length: 140,
                        width: 140,
                        xOff: 3,
                        yOff: 24,
                        dmg: 30,
                        spdMult: 1,
                        range: 70,
                        gather: 2,
                        speed: 400
                    }, {
                        id: 2,
                        type: 0,
                        age: 8,
                        pre: 1,
                        name: "great axe",
                        desc: "deal more damage and gather more resources",
                        src: "great_axe_1",
                        length: 140,
                        width: 140,
                        xOff: -8,
                        yOff: 25,
                        dmg: 35,
                        spdMult: 1,
                        range: 75,
                        gather: 4,
                        speed: 400
                    }, {
                        id: 3,
                        type: 0,
                        age: 2,
                        name: "short sword",
                        desc: "increased attack power but slower move speed",
                        src: "sword_1",
                        iPad: 1.3,
                        length: 130,
                        width: 210,
                        xOff: -8,
                        yOff: 46,
                        dmg: 35,
                        spdMult: 0.85,
                        range: 110,
                        gather: 1,
                        speed: 300
                    }, {
                        id: 4,
                        type: 0,
                        age: 8,
                        pre: 3,
                        name: "katana",
                        desc: "greater range and damage",
                        src: "samurai_1",
                        iPad: 1.3,
                        length: 130,
                        width: 210,
                        xOff: -8,
                        yOff: 59,
                        dmg: 40,
                        spdMult: 0.8,
                        range: 118,
                        gather: 1,
                        speed: 300
                    }, {
                        id: 5,
                        type: 0,
                        age: 2,
                        name: "polearm",
                        desc: "long range melee weapon",
                        src: "spear_1",
                        iPad: 1.3,
                        length: 130,
                        width: 210,
                        xOff: -8,
                        yOff: 53,
                        dmg: 45,
                        knock: 0.2,
                        spdMult: 0.82,
                        range: 142,
                        gather: 1,
                        speed: 700
                    }, {
                        id: 6,
                        type: 0,
                        age: 2,
                        name: "bat",
                        desc: "fast long range melee weapon",
                        src: "bat_1",
                        iPad: 1.3,
                        length: 110,
                        width: 180,
                        xOff: -8,
                        yOff: 53,
                        dmg: 20,
                        knock: 0.7,
                        range: 110,
                        gather: 1,
                        speed: 300
                    }, {
                        id: 7,
                        type: 0,
                        age: 2,
                        name: "daggers",
                        desc: "really fast short range weapon",
                        src: "dagger_1",
                        iPad: 0.8,
                        length: 110,
                        width: 110,
                        xOff: 18,
                        yOff: 0,
                        dmg: 20,
                        knock: 0.1,
                        range: 65,
                        gather: 1,
                        hitSlow: 0.1,
                        spdMult: 1.13,
                        speed: 100
                    }, {
                        id: 8,
                        type: 0,
                        age: 2,
                        name: "stick",
                        desc: "great for gathering but very weak",
                        src: "stick_1",
                        length: 140,
                        width: 140,
                        xOff: 3,
                        yOff: 24,
                        dmg: 1,
                        spdMult: 1,
                        range: 70,
                        gather: 7,
                        speed: 400
                    }, {
                        id: 9,
                        type: 1,
                        age: 6,
                        name: "hunting bow",
                        desc: "bow used for ranged combat and hunting",
                        src: "bow_1",
                        req: ["wood", 4],
                        length: 120,
                        width: 120,
                        xOff: -6,
                        yOff: 0,
                        Pdmg: 25,
                        projectile: 0,
                        spdMult: 0.75,
                        speed: 600
                    }, {
                        id: 10,
                        type: 1,
                        age: 6,
                        name: "great hammer",
                        desc: "hammer used for destroying structures",
                        src: "great_hammer_1",
                        length: 140,
                        width: 140,
                        xOff: -9,
                        yOff: 25,
                        dmg: 10,
                        Pdmg: 10,
                        spdMult: 0.88,
                        range: 75,
                        sDmg: 7.5,
                        gather: 1,
                        speed: 400
                    }, {
                        id: 11,
                        type: 1,
                        age: 6,
                        name: "wooden shield",
                        desc: "blocks projectiles and reduces melee damage",
                        src: "shield_1",
                        length: 120,
                        width: 120,
                        shield: 0.2,
                        xOff: 6,
                        yOff: 0,
                        Pdmg: 0,
                        spdMult: 0.7
                    }, {
                        id: 12,
                        type: 1,
                        age: 8,
                        pre: 9,
                        name: "crossbow",
                        desc: "deals more damage and has greater range",
                        src: "crossbow_1",
                        req: ["wood", 5],
                        aboveHand: true,
                        armS: 0.75,
                        length: 120,
                        width: 120,
                        xOff: -4,
                        yOff: 0,
                        Pdmg: 35,
                        projectile: 2,
                        spdMult: 0.7,
                        speed: 700
                    }, {
                        id: 13,
                        type: 1,
                        age: 9,
                        pre: 12,
                        name: "repeater crossbow",
                        desc: "high firerate crossbow with reduced damage",
                        src: "crossbow_2",
                        req: ["wood", 10],
                        aboveHand: true,
                        armS: 0.75,
                        length: 120,
                        width: 120,
                        xOff: -4,
                        yOff: 0,
                        Pdmg: 30,
                        projectile: 3,
                        spdMult: 0.7,
                        speed: 230
                    }, {
                        id: 14,
                        type: 1,
                        age: 6,
                        name: "mc grabby",
                        desc: "steals resources from enemies",
                        src: "grab_1",
                        length: 130,
                        width: 210,
                        xOff: -8,
                        yOff: 53,
                        dmg: 0,
                        Pdmg: 0,
                        steal: 250,
                        knock: 0.2,
                        spdMult: 1.05,
                        range: 125,
                        gather: 0,
                        speed: 700
                    }, {
                        id: 15,
                        type: 1,
                        age: 9,
                        pre: 12,
                        name: "musket",
                        desc: "slow firerate but high damage and range",
                        src: "musket_1",
                        req: ["stone", 10],
                        aboveHand: true,
                        rec: 0.35,
                        armS: 0.6,
                        hndS: 0.3,
                        hndD: 1.6,
                        length: 205,
                        width: 205,
                        xOff: 25,
                        yOff: 0,
                        Pdmg: 50,
                        projectile: 5,
                        hideProjectile: true,
                        spdMult: 0.6,
                        speed: 1500
                    }];
                    this.list = [{
                        group: this.groups[0],
                        name: "apple",
                        desc: "restores 20 health when consumed",
                        req: ["food", 10],
                        consume: function(doer) {
                            return doer.changeHealth(20, doer);
                        },
                        scale: 22,
                        holdOffset: 15,
                        healing: 20,
                        itemID: 0,
                        itemAID: 16,
                    }, {
                        age: 3,
                        group: this.groups[0],
                        name: "cookie",
                        desc: "restores 40 health when consumed",
                        req: ["food", 15],
                        consume: function(doer) {
                            return doer.changeHealth(40, doer);
                        },
                        scale: 27,
                        holdOffset: 15,
                        healing: 40,
                        itemID: 1,
                        itemAID: 17,
                    }, {
                        age: 7,
                        group: this.groups[0],
                        name: "cheese",
                        desc: "restores 30 health and another 50 over 5 seconds",
                        req: ["food", 25],
                        consume: function(doer) {
                            if (doer.changeHealth(30, doer) || doer.health < 100) {
                                doer.dmgOverTime.dmg = -10;
                                doer.dmgOverTime.doer = doer;
                                doer.dmgOverTime.time = 5;
                                return true;
                            }
                            return false;
                        },
                        scale: 27,
                        holdOffset: 15,
                        healing: 30,
                        itemID: 2,
                        itemAID: 18,
                    }, {
                        group: this.groups[1],
                        name: "wood wall",
                        desc: "provides protection for your village",
                        req: ["wood", 10],
                        projDmg: true,
                        health: 380,
                        scale: 50,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 3,
                        itemAID: 19,
                    }, {
                        age: 3,
                        group: this.groups[1],
                        name: "stone wall",
                        desc: "provides improved protection for your village",
                        req: ["stone", 25],
                        health: 900,
                        scale: 50,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 4,
                        itemAID: 20,
                    }, {
                        age: 7,
                        group: this.groups[1],
                        name: "castle wall",
                        desc: "provides powerful protection for your village",
                        req: ["stone", 35],
                        health: 1500,
                        scale: 52,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 5,
                        itemAID: 21,
                    }, {
                        group: this.groups[2],
                        name: "spikes",
                        desc: "damages enemies when they touch them",
                        req: ["wood", 20, "stone", 5],
                        health: 400,
                        dmg: 20,
                        scale: 49,
                        spritePadding: -23,
                        holdOffset: 8,
                        placeOffset: -5,
                        itemID: 6,
                        itemAID: 22,
                    }, {
                        age: 5,
                        group: this.groups[2],
                        name: "greater spikes",
                        desc: "damages enemies when they touch them",
                        req: ["wood", 30, "stone", 10],
                        health: 500,
                        dmg: 35,
                        scale: 52,
                        spritePadding: -23,
                        holdOffset: 8,
                        placeOffset: -5,
                        itemID: 7,
                        itemAID: 23,
                    }, {
                        age: 9,
                        group: this.groups[2],
                        name: "poison spikes",
                        desc: "poisons enemies when they touch them",
                        req: ["wood", 35, "stone", 15],
                        health: 600,
                        dmg: 30,
                        pDmg: 5,
                        scale: 52,
                        spritePadding: -23,
                        holdOffset: 8,
                        placeOffset: -5,
                        itemID: 8,
                        itemAID: 24,
                    }, {
                        age: 9,
                        group: this.groups[2],
                        name: "spinning spikes",
                        desc: "damages enemies when they touch them",
                        req: ["wood", 30, "stone", 20],
                        health: 500,
                        dmg: 45,
                        turnSpeed: 0.003,
                        scale: 52,
                        spritePadding: -23,
                        holdOffset: 8,
                        placeOffset: -5,
                        itemID: 9,
                        itemAID: 25,
                    }, {
                        group: this.groups[3],
                        name: "windmill",
                        desc: "generates gold over time",
                        req: ["wood", 50, "stone", 10],
                        health: 400,
                        pps: 1,
                        turnSpeed: 0.0016,
                        spritePadding: 25,
                        iconLineMult: 12,
                        scale: 45,
                        holdOffset: 20,
                        placeOffset: 5,
                        itemID: 10,
                        itemAID: 26,
                    }, {
                        age: 5,
                        group: this.groups[3],
                        name: "faster windmill",
                        desc: "generates more gold over time",
                        req: ["wood", 60, "stone", 20],
                        health: 500,
                        pps: 1.5,
                        turnSpeed: 0.0025,
                        spritePadding: 25,
                        iconLineMult: 12,
                        scale: 47,
                        holdOffset: 20,
                        placeOffset: 5,
                        itemID: 11,
                        itemAID: 27,
                    }, {
                        age: 8,
                        group: this.groups[3],
                        name: "power mill",
                        desc: "generates more gold over time",
                        req: ["wood", 100, "stone", 50],
                        health: 800,
                        pps: 2,
                        turnSpeed: 0.005,
                        spritePadding: 25,
                        iconLineMult: 12,
                        scale: 47,
                        holdOffset: 20,
                        placeOffset: 5,
                        itemID: 12,
                        itemAID: 28,
                    }, {
                        age: 5,
                        group: this.groups[4],
                        type: 2,
                        name: "mine",
                        desc: "allows you to mine stone",
                        req: ["wood", 20, "stone", 100],
                        iconLineMult: 12,
                        scale: 65,
                        holdOffset: 20,
                        placeOffset: 0,
                        itemID: 13,
                        itemAID: 29,
                    }, {
                        age: 5,
                        group: this.groups[11],
                        type: 0,
                        name: "sapling",
                        desc: "allows you to farm wood",
                        req: ["wood", 150],
                        iconLineMult: 12,
                        colDiv: 0.5,
                        scale: 110,
                        holdOffset: 50,
                        placeOffset: -15,
                        itemID: 14,
                        itemAID: 30,
                    }, {
                        age: 4,
                        group: this.groups[5],
                        name: "pit trap",
                        desc: "pit that traps enemies if they walk over it",
                        req: ["wood", 30, "stone", 30],
                        trap: true,
                        ignoreCollision: true,
                        hideFromEnemy: true,
                        health: 500,
                        colDiv: 0.2,
                        scale: 50,
                        holdOffset: 20,
                        placeOffset: -5,
                        alpha: 0.6,
                        itemID: 15,
                        itemAID: 31,
                    }, {
                        age: 4,
                        group: this.groups[6],
                        name: "boost pad",
                        desc: "provides boost when stepped on",
                        req: ["stone", 20, "wood", 5],
                        ignoreCollision: true,
                        boostSpeed: 1.5,
                        health: 150,
                        colDiv: 0.7,
                        scale: 45,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 16,
                        itemAID: 32,
                    }, {
                        age: 7,
                        group: this.groups[7],
                        doUpdate: true,
                        name: "turret",
                        desc: "defensive structure that shoots at enemies",
                        req: ["wood", 200, "stone", 150],
                        health: 800,
                        projectile: 1,
                        shootRange: 700,
                        shootRate: 2200,
                        scale: 43,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 17,
                        itemAID: 33,
                    }, {
                        age: 7,
                        group: this.groups[8],
                        name: "platform",
                        desc: "platform to shoot over walls and cross over water",
                        req: ["wood", 20],
                        ignoreCollision: true,
                        zIndex: 1,
                        health: 300,
                        scale: 43,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 18,
                        itemAID: 34,
                    }, {
                        age: 7,
                        group: this.groups[9],
                        name: "healing pad",
                        desc: "standing on it will slowly heal you",
                        req: ["wood", 30, "food", 10],
                        ignoreCollision: true,
                        healCol: 15,
                        health: 400,
                        colDiv: 0.7,
                        scale: 45,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 19,
                        itemAID: 35,
                    }, {
                        age: 9,
                        group: this.groups[10],
                        name: "spawn pad",
                        desc: "you will spawn here when you die but it will dissapear",
                        req: ["wood", 100, "stone", 100],
                        health: 400,
                        ignoreCollision: true,
                        spawnPoint: true,
                        scale: 45,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 20,
                        itemAID: 36,
                    }, {
                        age: 7,
                        group: this.groups[12],
                        name: "blocker",
                        desc: "blocks building in radius",
                        req: ["wood", 30, "stone", 25],
                        ignoreCollision: true,
                        blocker: 300,
                        health: 400,
                        colDiv: 0.7,
                        scale: 45,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 21,
                        itemAID: 37,
                    }, {
                        age: 7,
                        group: this.groups[13],
                        name: "teleporter",
                        desc: "teleports you to a random point on the map",
                        req: ["wood", 60, "stone", 60],
                        ignoreCollision: true,
                        teleport: true,
                        health: 200,
                        colDiv: 0.7,
                        scale: 45,
                        holdOffset: 20,
                        placeOffset: -5,
                        itemID: 22,
                        itemAID: 38
                    }];
                    this.checkItem = {
                        index: function(id, myItems) {
                            return [0, 1, 2].includes(id) ? 0 :
                            [3, 4, 5].includes(id) ? 1 :
                            [6, 7, 8, 9].includes(id) ? 2 :
                            [10, 11, 12].includes(id) ? 3 :
                            [13, 14].includes(id) ? 5 :
                            [15, 16].includes(id) ? 4 :
                            [17, 18, 19, 21, 22].includes(id) ?
                                [13, 14].includes(myItems) ? 6 :
                            5 :
                            id == 20 ?
                                [13, 14].includes(myItems) ? 7 :
                            6 :
                            undefined;
                        }
                    }
                    for (let i = 0; i < this.list.length; ++i) {
                        this.list[i].id = i;
                        if (this.list[i].pre) this.list[i].pre = i - this.list[i].pre;
                    }
                    if (typeof window !== "undefined") {
                        function shuffle(a) {
                            for (let i = a.length - 1; i > 0; i--) {
                                const j = Math.floor(Math.random() * (i + 1));
                                [a[i], a[j]] = [a[j], a[i]];
                            }
                            return a;
                        }
                    }
                }
            }
            class Objectmanager {
                constructor(GameObject, gameObjects, UTILS, config, players, server) {
                    let mathFloor = Math.floor,
                        mathABS = Math.abs,
                        mathCOS = Math.cos,
                        mathSIN = Math.sin,
                        mathPOW = Math.pow,
                        mathSQRT = Math.sqrt;
                    this.ignoreAdd = false;
                    this.hitObj = [];
                    this.disableObj = function(obj) {
                        obj.active = false;
                        if (config.anotherVisual) {
                        } else {
                            obj.alive = false;
                        }
                    };
                    let tmpObj;
                    this.add = function(sid, x, y, dir, s, type, data, setSID, owner) {
                        tmpObj = findObjectBySid(sid);
                        if (!tmpObj) {
                            tmpObj = gameObjects.find((tmp) => !tmp.active);
                            if (!tmpObj) {
                                tmpObj = new GameObject(sid);
                                gameObjects.push(tmpObj);
                            }
                        }
                        if (setSID) {
                            tmpObj.sid = sid;
                        }
                        tmpObj.init(x, y, dir, s, type, data, owner);
                    };
                    this.disableBySid = function(sid) {
                        let find = findObjectBySid(sid);
                        if (find) {
                            this.disableObj(find);
                        }
                    };
                    this.removeAllItems = function(sid, server) {
                        gameObjects.filter((tmp) => tmp.active && tmp.owner && tmp.owner.sid == sid).forEach((tmp) => this.disableObj(tmp));
                    };
                    this.checkItemLocation = function(x, y, s, sM, indx, ignoreWater, placer) {
                        let cantPlace = gameObjects.find((tmp) => tmp.active && UTILS.getDistance(x, y, tmp.x, tmp.y) < s + (tmp.blocker ? tmp.blocker : tmp.getScale(sM, tmp.isItem)));
                        if (cantPlace) return false;
                        if (!ignoreWater && indx != 18 && y >= config.mapScale / 2 - config.riverWidth / 2 && y <= config.mapScale / 2 + config.riverWidth / 2) return false;
                        return true;
                    };
                }
            }
            class Projectile {
                constructor(players, ais, objectManager, items, config, UTILS, server) {
                    this.init = function(indx, x, y, dir, spd, dmg, rng, scl, owner) {
                        this.active = true;
                        this.tickActive = true;
                        this.indx = indx;
                        this.x = x;
                        this.y = y;
                        this.x2 = x;
                        this.y2 = y;
                        this.dir = dir;
                        this.skipMov = true;
                        this.speed = spd;
                        this.dmg = dmg;
                        this.scale = scl;
                        this.range = rng;
                        this.r2 = rng;
                        this.owner = owner;
                    };
                    this.update = function(delta) {
                        if (this.active) {
                            let tmpSpeed = this.speed * delta;
                            if (!this.skipMov) {
                                this.x += tmpSpeed * Math.cos(this.dir);
                                this.y += tmpSpeed * Math.sin(this.dir);
                                this.range -= tmpSpeed;
                                if (this.range <= 0) {
                                    this.x += this.range * Math.cos(this.dir);
                                    this.y += this.range * Math.sin(this.dir);
                                    tmpSpeed = 1;
                                    this.range = 0;
                                    this.active = false;
                                }
                            } else {
                                this.skipMov = false;
                            }
                        }
                    };
                    this.tickUpdate = function(delta) {
                        if (this.tickActive) {
                            let tmpSpeed = this.speed * delta;
                            if (!this.skipMov) {
                                this.x2 += tmpSpeed * Math.cos(this.dir);
                                this.y2 += tmpSpeed * Math.sin(this.dir);
                                this.r2 -= tmpSpeed;
                                if (this.r2 <= 0) {
                                    this.x2 += this.r2 * Math.cos(this.dir);
                                    this.y2 += this.r2 * Math.sin(this.dir);
                                    tmpSpeed = 1;
                                    this.r2 = 0;
                                    this.tickActive = false;
                                }
                            } else {
                                this.skipMov = false;
                            }
                        }
                    };
                }
            };
            class Store {
                constructor() {
                    this.hats = [{
                        id: 45,
                        name: "Shame!",
                        dontSell: true,
                        price: 0,
                        scale: 120,
                        desc: "hacks are for winners"
                    }, {
                        id: 51,
                        name: "Moo Cap",
                        price: 0,
                        scale: 120,
                        desc: "coolest mooer around"
                    }, {
                        id: 50,
                        name: "Apple Cap",
                        price: 0,
                        scale: 120,
                        desc: "apple farms remembers"
                    }, {
                        id: 28,
                        name: "Moo Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 29,
                        name: "Pig Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 30,
                        name: "Fluff Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 36,
                        name: "Pandou Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 37,
                        name: "Bear Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 38,
                        name: "Monkey Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 44,
                        name: "Polar Head",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 35,
                        name: "Fez Hat",
                        price: 0,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 42,
                        name: "Enigma Hat",
                        price: 0,
                        scale: 120,
                        desc: "join the enigma army"
                    }, {
                        id: 43,
                        name: "Blitz Hat",
                        price: 0,
                        scale: 120,
                        desc: "hey everybody i'm blitz"
                    }, {
                        id: 49,
                        name: "Bob XIII Hat",
                        price: 0,
                        scale: 120,
                        desc: "like and subscribe"
                    }, {
                        id: 57,
                        name: "Pumpkin",
                        price: 50,
                        scale: 120,
                        desc: "Spooooky"
                    }, {
                        id: 8,
                        name: "Bummle Hat",
                        price: 100,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 2,
                        name: "Straw Hat",
                        price: 500,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 15,
                        name: "Winter Cap",
                        price: 600,
                        scale: 120,
                        desc: "allows you to move at normal speed in snow",
                        coldM: 1
                    }, {
                        id: 5,
                        name: "Cowboy Hat",
                        price: 1000,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 4,
                        name: "Ranger Hat",
                        price: 2000,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 18,
                        name: "Explorer Hat",
                        price: 2000,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 31,
                        name: "Flipper Hat",
                        price: 2500,
                        scale: 120,
                        desc: "have more control while in water",
                        watrImm: true
                    }, {
                        id: 1,
                        name: "Marksman Cap",
                        price: 3000,
                        scale: 120,
                        desc: "increases arrow speed and range",
                        aMlt: 1.3
                    }, {
                        id: 10,
                        name: "Bush Gear",
                        price: 3000,
                        scale: 160,
                        desc: "allows you to disguise yourself as a bush"
                    }, {
                        id: 48,
                        name: "Halo",
                        price: 3000,
                        scale: 120,
                        desc: "no effect"
                    }, {
                        id: 6,
                        name: "Soldier Helmet",
                        price: 4000,
                        scale: 120,
                        desc: "reduces damage taken but slows movement",
                        spdMult: 0.94,
                        dmgMult: 0.75
                    }, {
                        id: 23,
                        name: "Anti Venom Gear",
                        price: 4000,
                        scale: 120,
                        desc: "makes you immune to poison",
                        poisonRes: 1
                    }, {
                        id: 13,
                        name: "Medic Gear",
                        price: 5000,
                        scale: 110,
                        desc: "slowly regenerates health over time",
                        healthRegen: 3
                    }, {
                        id: 9,
                        name: "Miners Helmet",
                        price: 5000,
                        scale: 120,
                        desc: "earn 1 extra gold per resource",
                        extraGold: 1
                    }, {
                        id: 32,
                        name: "Musketeer Hat",
                        price: 5000,
                        scale: 120,
                        desc: "reduces cost of projectiles",
                        projCost: 0.5
                    }, {
                        id: 7,
                        name: "Bull Helmet",
                        price: 6000,
                        scale: 120,
                        desc: "increases damage done but drains health",
                        healthRegen: -5,
                        dmgMultO: 1.5,
                        spdMult: 0.96
                    }, {
                        id: 22,
                        name: "Emp Helmet",
                        price: 6000,
                        scale: 120,
                        desc: "turrets won't attack but you move slower",
                        antiTurret: 1,
                        spdMult: 0.7
                    }, {
                        id: 12,
                        name: "Booster Hat",
                        price: 6000,
                        scale: 120,
                        desc: "increases your movement speed",
                        spdMult: 1.16
                    }, {
                        id: 26,
                        name: "Barbarian Armor",
                        price: 8000,
                        scale: 120,
                        desc: "knocks back enemies that attack you",
                        dmgK: 0.6
                    }, {
                        id: 21,
                        name: "Plague Mask",
                        price: 10000,
                        scale: 120,
                        desc: "melee attacks deal poison damage",
                        poisonDmg: 5,
                        poisonTime: 6
                    }, {
                        id: 46,
                        name: "Bull Mask",
                        price: 10000,
                        scale: 120,
                        desc: "bulls won't target you unless you attack them",
                        bullRepel: 1
                    }, {
                        id: 14,
                        name: "Windmill Hat",
                        topSprite: true,
                        price: 10000,
                        scale: 120,
                        desc: "generates points while worn",
                        pps: 1.5
                    }, {
                        id: 11,
                        name: "Spike Gear",
                        topSprite: true,
                        price: 10000,
                        scale: 120,
                        desc: "deal damage to players that damage you",
                        dmg: 0.45
                    }, {
                        id: 53,
                        name: "Turret Gear",
                        topSprite: true,
                        price: 10000,
                        scale: 120,
                        desc: "you become a walking turret",
                        turret: {
                            proj: 1,
                            range: 700,
                            rate: 2500
                        },
                        spdMult: 0.7
                    }, {
                        id: 20,
                        name: "Samurai Armor",
                        price: 12000,
                        scale: 120,
                        desc: "increased attack speed and fire rate",
                        atkSpd: 0.78
                    }, {
                        id: 58,
                        name: "Dark Knight",
                        price: 12000,
                        scale: 120,
                        desc: "restores health when you deal damage",
                        healD: 0.4
                    }, {
                        id: 27,
                        name: "Scavenger Gear",
                        price: 15000,
                        scale: 120,
                        desc: "earn double points for each kill",
                        kScrM: 2
                    }, {
                        id: 40,
                        name: "Tank Gear",
                        price: 15000,
                        scale: 120,
                        desc: "increased damage to buildings but slower movement",
                        spdMult: 0.3,
                        bDmg: 3.3
                    }, {
                        id: 52,
                        name: "Thief Gear",
                        price: 15000,
                        scale: 120,
                        desc: "steal half of a players gold when you kill them",
                        goldSteal: 0.5
                    }, {
                        id: 55,
                        name: "Bloodthirster",
                        price: 20000,
                        scale: 120,
                        desc: "Restore Health when dealing damage. And increased damage",
                        healD: 0.25,
                        dmgMultO: 1.2,
                    }, {
                        id: 56,
                        name: "Assassin Gear",
                        price: 20000,
                        scale: 120,
                        desc: "Go invisible when not moving. Can't eat. Increased speed",
                        noEat: true,
                        spdMult: 1.1,
                        invisTimer: 1000
                    }];
                    this.accessories = [{
                        id: 12,
                        name: "Snowball",
                        price: 1000,
                        scale: 105,
                        xOff: 18,
                        desc: "no effect"
                    }, {
                        id: 9,
                        name: "Tree Cape",
                        price: 1000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 10,
                        name: "Stone Cape",
                        price: 1000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 3,
                        name: "Cookie Cape",
                        price: 1500,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 8,
                        name: "Cow Cape",
                        price: 2000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 11,
                        name: "Monkey Tail",
                        price: 2000,
                        scale: 97,
                        xOff: 25,
                        desc: "Super speed but reduced damage",
                        spdMult: 1.35,
                        dmgMultO: 0.2
                    }, {
                        id: 17,
                        name: "Apple Basket",
                        price: 3000,
                        scale: 80,
                        xOff: 12,
                        desc: "slowly regenerates health over time",
                        healthRegen: 1
                    }, {
                        id: 6,
                        name: "Winter Cape",
                        price: 3000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 4,
                        name: "Skull Cape",
                        price: 4000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 5,
                        name: "Dash Cape",
                        price: 5000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 2,
                        name: "Dragon Cape",
                        price: 6000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 1,
                        name: "Super Cape",
                        price: 8000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 7,
                        name: "Troll Cape",
                        price: 8000,
                        scale: 90,
                        desc: "no effect"
                    }, {
                        id: 14,
                        name: "Thorns",
                        price: 10000,
                        scale: 115,
                        xOff: 20,
                        desc: "no effect"
                    }, {
                        id: 15,
                        name: "Blockades",
                        price: 10000,
                        scale: 95,
                        xOff: 15,
                        desc: "no effect"
                    }, {
                        id: 20,
                        name: "Devils Tail",
                        price: 10000,
                        scale: 95,
                        xOff: 20,
                        desc: "no effect"
                    }, {
                        id: 16,
                        name: "Sawblade",
                        price: 12000,
                        scale: 90,
                        spin: true,
                        xOff: 0,
                        desc: "deal damage to players that damage you",
                        dmg: 0.15
                    }, {
                        id: 13,
                        name: "Angel Wings",
                        price: 15000,
                        scale: 138,
                        xOff: 22,
                        desc: "slowly regenerates health over time",
                        healthRegen: 3
                    }, {
                        id: 19,
                        name: "Shadow Wings",
                        price: 15000,
                        scale: 138,
                        xOff: 22,
                        desc: "increased movement speed",
                        spdMult: 1.1
                    }, {
                        id: 18,
                        name: "Blood Wings",
                        price: 20000,
                        scale: 178,
                        xOff: 26,
                        desc: "restores health when you deal damage",
                        healD: 0.2
                    }, {
                        id: 21,
                        name: "Corrupt X Wings",
                        price: 20000,
                        scale: 178,
                        xOff: 26,
                        desc: "deal damage to players that damage you",
                        dmg: 0.25
                    }];
                }
            };
            class ProjectileManager {
                constructor(Projectile, projectiles, players, ais, objectManager, items, config, UTILS, server) {
                    this.addProjectile = function (x, y, dir, range, speed, indx, owner, ignoreObj, layer, inWindow) {
                        let tmpData = items.projectiles[indx];
                        let tmpProj;
                        for (let i = 0; i < projectiles.length; ++i) {
                            if (!projectiles[i].active) {
                                tmpProj = projectiles[i];
                                break;
                            }
                        }
                        if (!tmpProj) {
                            tmpProj = new Projectile(players, ais, objectManager, items, config, UTILS, server);
                            tmpProj.sid = projectiles.length;
                            projectiles.push(tmpProj);
                        }
                        tmpProj.init(indx, x, y, dir, speed, tmpData.dmg, range, tmpData.scale, owner);
                        tmpProj.ignoreObj = ignoreObj;
                        tmpProj.layer = layer || tmpData.layer;
                        tmpProj.inWindow = inWindow;
                        tmpProj.src = tmpData.src;
                        return tmpProj;
                    };
                }
            };
            class AiManager {

                // AI MANAGER:
                constructor(ais, AI, players, items, objectManager, config, UTILS, scoreCallback, server) {

                    // AI TYPES:
                    this.aiTypes = [{
                        id: 0,
                        src: "cow_1",
                        killScore: 150,
                        health: 500,
                        weightM: 0.8,
                        speed: 0.00095,
                        turnSpeed: 0.001,
                        scale: 72,
                        drop: ["food", 50]
                    }, {
                        id: 1,
                        src: "pig_1",
                        killScore: 200,
                        health: 800,
                        weightM: 0.6,
                        speed: 0.00085,
                        turnSpeed: 0.001,
                        scale: 72,
                        drop: ["food", 80]
                    }, {
                        id: 2,
                        name: "Bull",
                        src: "bull_2",
                        hostile: true,
                        dmg: 20,
                        killScore: 1000,
                        health: 1800,
                        weightM: 0.5,
                        speed: 0.00094,
                        turnSpeed: 0.00074,
                        scale: 78,
                        viewRange: 800,
                        chargePlayer: true,
                        drop: ["food", 100]
                    }, {
                        id: 3,
                        name: "Bully",
                        src: "bull_1",
                        hostile: true,
                        dmg: 20,
                        killScore: 2000,
                        health: 2800,
                        weightM: 0.45,
                        speed: 0.001,
                        turnSpeed: 0.0008,
                        scale: 90,
                        viewRange: 900,
                        chargePlayer: true,
                        drop: ["food", 400]
                    }, {
                        id: 4,
                        name: "Wolf",
                        src: "wolf_1",
                        hostile: true,
                        dmg: 8,
                        killScore: 500,
                        health: 300,
                        weightM: 0.45,
                        speed: 0.001,
                        turnSpeed: 0.002,
                        scale: 84,
                        viewRange: 800,
                        chargePlayer: true,
                        drop: ["food", 200]
                    }, {
                        id: 5,
                        name: "Quack",
                        src: "chicken_1",
                        dmg: 8,
                        killScore: 2000,
                        noTrap: true,
                        health: 300,
                        weightM: 0.2,
                        speed: 0.0018,
                        turnSpeed: 0.006,
                        scale: 70,
                        drop: ["food", 100]
                    }, {
                        id: 6,
                        name: "MOOSTAFA",
                        nameScale: 50,
                        src: "enemy",
                        hostile: true,
                        dontRun: true,
                        fixedSpawn: true,
                        spawnDelay: 60000,
                        noTrap: true,
                        colDmg: 100,
                        dmg: 40,
                        killScore: 8000,
                        health: 18000,
                        weightM: 0.4,
                        speed: 0.0007,
                        turnSpeed: 0.01,
                        scale: 80,
                        spriteMlt: 1.8,
                        leapForce: 0.9,
                        viewRange: 1000,
                        hitRange: 210,
                        hitDelay: 1000,
                        chargePlayer: true,
                        drop: ["food", 100]
                    }, {
                        id: 7,
                        name: "Treasure",
                        hostile: true,
                        nameScale: 35,
                        src: "crate_1",
                        fixedSpawn: true,
                        spawnDelay: 120000,
                        colDmg: 200,
                        killScore: 5000,
                        health: 20000,
                        weightM: 0.1,
                        speed: 0.0,
                        turnSpeed: 0.0,
                        scale: 70,
                        spriteMlt: 1.0
                    }, {
                        id: 8,
                        name: "MOOFIE",
                        src: "wolf_2",
                        hostile: true,
                        fixedSpawn: true,
                        dontRun: true,
                        hitScare: 4,
                        spawnDelay: 30000,
                        noTrap: true,
                        nameScale: 35,
                        dmg: 10,
                        colDmg: 100,
                        killScore: 3000,
                        health: 7000,
                        weightM: 0.45,
                        speed: 0.0015,
                        turnSpeed: 0.002,
                        scale: 90,
                        viewRange: 800,
                        chargePlayer: true,
                        drop: ["food", 1000]
                    }];

                    // SPAWN AI:
                    this.spawn = function (x, y, dir, index) {
                        let tmpObj = ais.find((tmp) => !tmp.active);
                        if (!tmpObj) {
                            tmpObj = new AI(ais.length, objectManager, players, items, UTILS, config, scoreCallback, server);
                            ais.push(tmpObj);
                        }
                        tmpObj.init(x, y, dir, index, this.aiTypes[index]);
                        return tmpObj;
                    };
                }

            };
            class AI {
                constructor(sid, objectManager, players, items, UTILS, config, scoreCallback, server) {
                    this.sid = sid;
                    this.isAI = true;
                    this.nameIndex = UTILS.randInt(0, config.cowNames.length - 1);
                    this.init = function(x, y, dir, index, data) {
                        this.x = x;
                        this.y = y;
                        this.xVel = 0;
                        this.yVel = 0;
                        this.zIndex = 0;
                        this.dir = dir;
                        this.dirPlus = 0;
                        this.index = index;
                        this.src = data.src;
                        if (data.name) this.name = data.name;
                        this.weightM = data.weightM;
                        this.speed = data.speed;
                        this.killScore = data.killScore;
                        this.turnSpeed = data.turnSpeed;
                        this.scale = data.scale;
                        this.maxHealth = data.health;
                        this.leapForce = data.leapForce;
                        this.health = this.maxHealth;
                        this.chargePlayer = data.chargePlayer;
                        this.viewRange = data.viewRange;
                        this.drop = data.drop;
                        this.dmg = data.dmg;
                        this.hostile = data.hostile;
                        this.dontRun = data.dontRun;
                        this.hitRange = data.hitRange;
                        this.hitDelay = data.hitDelay;
                        this.hitScare = data.hitScare;
                        this.spriteMlt = data.spriteMlt;
                        this.nameScale = data.nameScale;
                        this.colDmg = data.colDmg;
                        this.noTrap = data.noTrap;
                        this.spawnDelay = data.spawnDelay;
                        this.hitWait = 0;
                        this.waitCount = 1000;
                        this.moveCount = 0;
                        this.targetDir = 0;
                        this.active = true;
                        this.alive = true;
                        this.runFrom = null;
                        this.chargeTarget = null;
                        this.dmgOverTime = {};
                    };
                    let tmpRatio = 0;
                    let animIndex = 0;
                    this.animate = function(delta) {
                        if (this.animTime > 0) {
                            this.animTime -= delta;
                            if (this.animTime <= 0) {
                                this.animTime = 0;
                                this.dirPlus = 0;
                                tmpRatio = 0;
                                animIndex = 0;
                            } else {
                                if (animIndex == 0) {
                                    tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                                    if (tmpRatio >= 1) {
                                        tmpRatio = 1;
                                        animIndex = 1;
                                    }
                                } else {
                                    tmpRatio -= delta / (this.animSpeed * (1 - config.hitReturnRatio));
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                                }
                            }
                        }
                    };
                    this.startAnim = function() {
                        this.animTime = this.animSpeed = 600;
                        this.targetAngle = Math.PI * 0.8;
                        tmpRatio = 0;
                        animIndex = 0;
                    };
                };
            };
            class addCh {
                constructor(x, y, chat, tmpObj) {
                    this.x = x;
                    this.y = y;
                    this.alpha = 0;
                    this.active = true;
                    this.alive = false;
                    this.chat = chat;
                    this.owner = tmpObj;
                };
            };
            class DeadPlayer {
                constructor(x, y, dir, buildIndex, weaponIndex, weaponVariant, skinColor, scale, name) {
                    this.x = x;
                    this.y = y;
                    this.lastDir = dir;
                    this.dir = dir + Math.PI;
                    this.buildIndex = buildIndex;
                    this.weaponIndex = weaponIndex;
                    this.weaponVariant = weaponVariant;
                    this.skinColor = skinColor;
                    this.scale = scale;
                    this.visScale = 0;
                    this.name = name;
                    this.alpha = 1;
                    this.active = true;
                    this.animate = function(delta) {
                        let d2 = UTILS.getAngleDist(this.lastDir, this.dir);
                        if (d2 > 0.01) {
                            this.dir += d2 / 20;
                        } else {
                            this.dir = this.lastDir;
                        }
                        if (this.visScale < this.scale) {
                            this.visScale += delta / (this.scale / 2);
                            if (this.visScale >= this.scale) {
                                this.visScale = this.scale;
                            }
                        }
                        this.alpha -= delta / 30000;
                        if (this.alpha <= 0) {
                            this.alpha = 0;
                            this.active = false;
                        }
                    }
                }
            };
            class Player {
                constructor(id, sid, config, UTILS, projectileManager, objectManager, players, ais, items, hats, accessories, server, scoreCallback, iconCallback) {
                    this.id = id;
                    this.sid = sid;
                    this.tmpScore = 0;
                    this.team = null;
                    this.latestSkin = 0;
                    this.oldSkinIndex = 0;
                    this.skinIndex = 0;
                    this.latestTail = 0;
                    this.oldTailIndex = 0;
                    this.tailIndex = 0;
                    this.hitTime = 0;
                    this.lastHit = 0;
                    this.tails = {};
                    for (let i = 0; i < accessories.length; ++i) {
                        if (accessories[i].price <= 0)
                            this.tails[accessories[i].id] = 1;
                    }
                    this.skins = {};
                    for (let i = 0; i < hats.length; ++i) {
                        if (hats[i].price <= 0)
                            this.skins[hats[i].id] = 1;
                    }
                    this.points = 0;
                    this.dt = 0;
                    this.hidden = false;
                    this.itemCounts = {};
                    this.isPlayer = true;
                    this.pps = 0;
                    this.moveDir = undefined;
                    this.randDIff = Math.random * Math.PI * 2;
                    this.skinRot = 0;
                    this.lastPing = 0;
                    this.iconIndex = 0;
                    this.skinColor = 0;
                    this.dist2 = 0;
                    this.aim2 = 0;
                    this.maxSpeed = 1;
                    this.chat = {
                        message: null,
                        count: 0
                    };
                    this.backupNobull = true;
                    this.circle = false;
                    this.circleRad = 200;
                    this.cAngle = 0;
                    this.spawn = function(moofoll) {
                        this.attacked = false;
                        this.death = false;
                        this.spinDir = 0;
                        this.sync = false;
                        this.antiBull = 0;
                        this.bullTimer = 0;
                        this.poisonTimer = 0;
                        this.active = true;
                        this.alive = true;
                        this.lockMove = false;
                        this.lockDir = false;
                        this.minimapCounter = 0;
                        this.chatCountdown = 0;
                        this.shameCount = 0;
                        this.maxShameCount = 0;
                        this.deathDir = Math.random() * Math.PI * 2;
                        this.shameTimer = 0;
                        this.sentTo = {};
                        this.gathering = 0;
                        this.gatherIndex = 0;
                        this.shooting = {};
                        this.shootIndex = 9;
                        this.autoGather = 0;
                        this.animTime = 0;
                        this.animSpeed = 0;
                        this.mouseState = 0;
                        this.buildIndex = -1;
                        this.weaponIndex = 0;
                        this.weaponCode = 0;
                        this.weaponVariant = 0;
                        this.primaryIndex = undefined;
                        this.secondaryIndex = undefined;
                        this.dmgOverTime = {};
                        this.noMovTimer = 0;
                        this.maxXP = 300;
                        this.XP = 0;
                        this.age = 1;
                        this.kills = 0;
                        this.upgrAge = 2;
                        this.upgradePoints = 0;
                        this.x = 0;
                        this.y = 0;
                        this.oldXY = {
                            x: 0,
                            y: 0
                        };
                        this.zIndex = 0;
                        this.xVel = 0;
                        this.yVel = 0;
                        this.slowMult = 1;
                        this.dir = 0;
                        this.dirPlus = 0;
                        this.targetDir = 0;
                        this.targetAngle = 0;
                        this.maxHealth = 100;
                        this.health = this.maxHealth;
                        this.oldHealth = this.maxHealth;
                        this.damaged = 0;
                        this.scale = config.playerScale;
                        this.speed = config.playerSpeed;
                        this.resetMoveDir();
                        this.resetResources(moofoll);
                        this.items = [0, 3, 6, 10];
                        this.weapons = [0];
                        this.shootCount = 0;
                        this.weaponXP = [];
                        this.reloads = {
                            0: 0,
                            1: 0,
                            2: 0,
                            3: 0,
                            4: 0,
                            5: 0,
                            6: 0,
                            7: 0,
                            8: 0,
                            9: 0,
                            10: 0,
                            11: 0,
                            12: 0,
                            13: 0,
                            14: 0,
                            15: 0,
                            53: 0,
                        };
                        this.bowThreat = {
                            9: 0,
                            12: 0,
                            13: 0,
                            15: 0,
                        };
                        this.damageThreat = 0;
                        this.inTrap = false;
                        this.canEmpAnti = false;
                        this.empAnti = false;
                        this.soldierAnti = false;
                        this.poisonTick = 0;
                        this.bullTick = 0;
                        this.setPoisonTick = false;
                        this.setBullTick = false;
                        this.antiTimer = 4;
                    };
                    this.resetMoveDir = function() {
                        this.moveDir = undefined;
                    };
                    this.resetResources = function(moofoll) {
                        for (let i = 0; i < config.resourceTypes.length; ++i) {
                            this[config.resourceTypes[i]] = moofoll ? 100 : 0;
                        }
                    };
                    this.getItemType = function(id) {
                        let findindx = this.items.findIndex((ids) => ids == id);
                        if (findindx != -1) {
                            return findindx;
                        } else {
                            return items.checkItem.index(id, this.items);
                        }
                    };
                    this.setData = function(data) {
                        this.id = data[0];
                        this.sid = data[1];
                        this.name = data[2];
                        this.x = data[3];
                        this.y = data[4];
                        this.dir = data[5];
                        this.health = data[6];
                        this.maxHealth = data[7];
                        this.scale = data[8];
                        this.skinColor = data[9];
                    };
                    this.updateTimer = function() {
                        this.bullTimer -= 1;
                        if (this.bullTimer <= 0) {
                            this.setBullTick = false;
                            this.bullTick = game.tick - 1;
                            this.bullTimer = config.serverUpdateRate;
                        }
                        this.poisonTimer -= 1;
                        if (this.poisonTimer < 0) {
                            this.setPoisonTick = false;
                            this.poisonTick = game.tick - 1;
                            this.poisonTimer = config.serverUpdateRate;
                            plaguemask = true;
                            setTimeout(() => {
                                plaguemask = false;
                            }, 1000);
                        } else if(this.poisonTimer >= 0) {
                            plaguemask = false;
                        }
                    };
                    this.update = function(delta) {
                        if (this.alive) {
                            if (this.health != this.healthMov) {
                                this.health < this.healthMov ? (this.healthMov -= 2) : (this.healthMov += 2);
                                if (Math.abs(this.health - this.healthMov) < 2) this.healthMov = this.health;
                            };
                            if (this.shameCount != this.shameMov) this.shameCount < this.shameMov ? (this.shameMov -= .1) : (this.shameMov += .1), Math.abs(this.shameCount - this.shameMov) < .1 && (this.shameMov = this.shameCount);
                        }
                        if (this.active) {
                            let gear = {
                                skin: findID(hats, this.skinIndex),
                                tail: findID(accessories, this.tailIndex)
                            }
                            let spdMult = ((this.buildIndex >= 0) ? 0.5 : 1) * (items.weapons[this.weaponIndex].spdMult || 1) * (gear.skin ? (gear.skin.spdMult || 1) : 1) * (gear.tail ? (gear.tail.spdMult || 1) : 1) * (this.y <= config.snowBiomeTop ? ((gear.skin && gear.skin.coldM) ? 1 : config.snowSpeed) : 1) * this.slowMult;
                            this.maxSpeed = spdMult;
                        }
                    };
                    let tmpRatio = 0;
                    let animIndex = 0;
                    this.animate = function(delta) {
                        if (this.animTime > 0) {
                            this.animTime -= delta;
                            if (this.animTime <= 0) {
                                this.animTime = 0;
                                this.dirPlus = 0;
                                tmpRatio = 0;
                                animIndex = 0;
                            } else {
                                if (animIndex == 0) {
                                    tmpRatio += delta / (this.animSpeed * config.hitReturnRatio);
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.min(1, tmpRatio));
                                    if (tmpRatio >= 1) {
                                        tmpRatio = 1;
                                        animIndex = 1;
                                    }
                                } else {
                                    tmpRatio -= delta / (this.animSpeed * (1 - config.hitReturnRatio));
                                    this.dirPlus = UTILS.lerp(0, this.targetAngle, Math.max(0, tmpRatio));
                                }
                            }
                        }
                    };
                    this.startAnim = function(didHit, index) {
                        this.animTime = this.animSpeed = items.weapons[index].speed;
                        this.targetAngle = (didHit ? -config.hitAngle : -Math.PI);
                        tmpRatio = 0;
                        animIndex = 0;
                    };
                    this.canSee = function(other) {
                        if (!other) return false;
                        let dx = Math.abs(other.x - this.x) - other.scale;
                        let dy = Math.abs(other.y - this.y) - other.scale;
                        return dx <= (config.maxScreenWidth / 2) * 1.3 && dy <= (config.maxScreenHeight / 2) * 1.3;
                    };
                    this.judgeShame = function() {
                        if (this.oldHealth < this.health) {
                            if (this.hitTime) {
                                let timeSinceHit = Date.now() - this.hitTime;
                                this.lastHit = game.tick;
                                this.hitTime = 0;
                                if (timeSinceHit < 120) {
                                    this.shameCount++;
                                } else {
                                    this.shameCount = Math.max(0, this.shameCount - 2);
                                }
                            }
                        } else if (this.oldHealth > this.health) {
                            this.hitTime = Date.now();
                        }
                    };
                    this.addShameTimer = function() {
                        this.shameCount = 0;
                        this.shameTimer = 30;
                        let interval = setInterval(() => {
                            this.shameTimer--;
                            if (this.shameTimer <= 0) {
                                clearInterval(interval);
                            }
                        }, 1000);
                    };
                    this.isTeam = function(tmpObj) {
                        return (this == tmpObj || (this.team && this.team == tmpObj.team));
                    };
                    this.findAllianceBySid = function(sid) {
                        return this.team ? alliancePlayers.find((THIS) => THIS === sid) : null;
                    };
                    this.checkCanInsta = function(nobull) {
                        let totally = 0;
                        if (this.alive && inGame) {
                            let primary = {
                                weapon: this.weapons[0],
                                variant: this.primaryVariant,
                                dmg: this.weapons[0] == undefined ? 0 : items.weapons[this.weapons[0]].dmg,
                            };
                            let secondary = {
                                weapon: this.weapons[1],
                                variant: this.secondaryVariant,
                                dmg: this.weapons[1] == undefined ? 0 : items.weapons[this.weapons[1]].Pdmg,
                            };
                            let bull = this.skins[7] && !nobull ? 1.5 : 1;
                            let pV = primary.variant != undefined ? config.weaponVariants[primary.variant].val : 1;
                            if (primary.weapon != undefined && this.reloads[primary.weapon] == 0) {
                                totally += primary.dmg * pV * bull;
                            }
                            if (secondary.weapon != undefined && this.reloads[secondary.weapon] == 0) {
                                totally += secondary.dmg;
                            }
                            if (this.skins[53] && this.reloads[53] <= (player.weapons[1] == 10 ? 0 : game.tickRate) && near.skinIndex != 22) {
                                totally += 25;
                            }
                            totally *= near.skinIndex == 6 ? 0.75 : 1;
                            return totally;
                        }
                        return 0;
                    };
                    this.manageReload = function() {
                        if (this.shooting[53]) {
                            this.shooting[53] = 0;
                            this.reloads[53] = (2500 - game.tickRate);
                        } else {
                            if (this.reloads[53] > 0) {
                                this.reloads[53] = Math.max(0, this.reloads[53] - game.tickRate);
                            }
                        }
                        if (this.gathering || this.shooting[1]) {
                            if (this.gathering) {
                                this.gathering = 0;
                                this.reloads[this.gatherIndex] = (items.weapons[this.gatherIndex].speed * (this.skinIndex == 20 ? 0.78 : 1));
                                this.attacked = true;
                            }
                            if (this.shooting[1]) {
                                this.shooting[1] = 0;
                                this.reloads[this.shootIndex] = (items.weapons[this.shootIndex].speed * (this.skinIndex == 20 ? 0.78 : 1));
                                this.attacked = true;
                            }
                        } else {
                            this.attacked = false;
                            if (this.buildIndex < 0) {
                                if (this.reloads[this.weaponIndex] > 0) {
                                    this.reloads[this.weaponIndex] = Math.max(0, this.reloads[this.weaponIndex] - game.tickRate);
                                    if (this == player) {
                                        if (configs3.WeaponGrinder) {
                                            for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                                                checkPlace(player.getItemType(22), i);
                                            }
                                        }
                                    }
                                    if (this.reloads[this.primaryIndex] < 1 || this.reloads[this.weaponIndex] < 1) {
                                        this.antiBull++;
                                        game.tickBase(() => {
                                            this.antiBull = 0;
                                        }, 1);
                                    }
                                }
                            }
                        }
                    };
                    this.addDamageThreat = function(tmpObj) {
                        let primary = {
                            weapon: this.primaryIndex,
                            variant: this.primaryVariant
                        };
                        primary.dmg = primary.weapon == undefined ? 45 : items.weapons[primary.weapon].dmg;
                        let secondary = {
                            weapon: this.secondaryIndex,
                            variant: this.secondaryVariant
                        };
                        secondary.dmg = secondary.weapon == undefined ? 50 : items.weapons[secondary.weapon].Pdmg;
                        let bull = 1.5;
                        let pV = primary.variant != undefined ? config.weaponVariants[primary.variant].val : 1.18;
                        let sV = secondary.variant != undefined ? [9, 12, 13, 15].includes(secondary.weapon) ? 1 : config.weaponVariants[secondary.variant].val : 1.18;
                        if (primary.weapon == undefined ? true : this.reloads[primary.weapon] == 0) {
                            this.damageThreat += primary.dmg * pV * bull;
                        }
                        if (secondary.weapon == undefined ? true : this.reloads[secondary.weapon] == 0) {
                            this.damageThreat += secondary.dmg * sV;
                        }
                        if (this.reloads[53] <= game.tickRate) {
                            this.damageThreat += 25;
                        }
                        this.damageThreat *= tmpObj.skinIndex == 6 ? 0.75 : 1;
                        if (!this.isTeam(tmpObj)) {
                            if (this.dist2 <= 300) {
                                tmpObj.damageThreat += this.damageThreat;
                            }
                        }
                    };
                }
            };
            let hatElement = document.getElementById("hatdisp22");
            hatElement.onclick = function() {
                storeBuy(22, 0);
            };
            let hatElement2 = document.getElementById("hatdisp7");
            hatElement2.onclick = function() {
                storeBuy(7, 0);
            };
            let hatElement3 = document.getElementById("hatdisp6");
            hatElement3.onclick = function() {
                storeBuy(6, 0);
            };
            let hatElement4 = document.getElementById("hatdisp40");
            hatElement4.onclick = function() {
                storeBuy(40, 0);
            };
            let hatElement5 = document.getElementById("hatdisp21");
            hatElement5.onclick = function() {
                storeBuy(21, 0);
            };
            let hatElement6 = document.getElementById("hatdisp12");
            hatElement5.onclick = function() {
                storeBuy(12, 0);
            };
            let hatElement7 = document.getElementById("hatdisp56");
            hatElement5.onclick = function() {
                storeBuy(56, 0);
            };
            let accElement = document.getElementById("accdisp19");
            accElement.onclick = function() {
                storeBuy(19, 1);
            };
            let accElement1 = document.getElementById("accdisp18");
            accElement1.onclick = function() {
                storeBuy(18, 1);
            };
            let accElement2 = document.getElementById("accdisp21");
            accElement2.onclick = function() {
                storeBuy(21, 1);
            };
            function sendUpgrade(index) {
                player.reloads[index] = 0;
                packet("H", index);
            }
            function storeEquip(id, index) {
                packet("c", 0, id, index);
            }
            function storeBuy(id, index) {
                packet("c", 1, id, index);
            }
            function buyEquip(id, index) {
                let nID = player.skins[6] ? Soldier : 0;
                if (player.alive && inGame) {
                    if (index == 0) {
                        if (player.skins[id]) {
                            if (player.latestSkin != id) {
                                packet("c", 0, id, 0);
                            }
                        } else {
                            if (configs.autoBuyEquip) {
                                let find = findID(hats, id);
                                if (find) {
                                    if (player.points >= find.price) {
                                        packet("c", 1, id, 0);
                                        packet("c", 0, id, 0);
                                    } else {
                                        if (player.latestSkin != nID) {
                                            packet("c", 0, nID, 0);
                                        }
                                    }
                                } else {
                                    if (player.latestSkin != nID) {
                                        packet("c", 0, nID, 0);
                                    }
                                }
                            } else {
                                if (player.latestSkin != nID) {
                                    packet("c", 0, nID, 0);
                                }
                            }
                        }
                    } else if (index == 1) {
                        if (player.tails[id]) {
                            if (player.latestTail != id) {
                                packet("c", 0, id, 1);
                            }
                        } else {
                            if (configs.autoBuyEquip) {
                                let find = findID(accessories, id);
                                if (find) {
                                    if (player.points >= find.price) {
                                        packet("c", 1, id, 1);
                                        packet("c", 0, id, 1);
                                    } else {
                                        if (player.latestTail != 0) {
                                            packet("c", 0, 0, 1);
                                        }
                                    }
                                } else {
                                    if (player.latestTail != 0) {
                                        packet("c", 0, 0, 1);
                                    }
                                }
                            } else {
                                if (player.latestTail != 0) {
                                    packet("c", 0, 0, 1);
                                }
                            }
                        }
                    }
                }
            }
            function selectToBuild(index, wpn) {
                packet("G", index, wpn);
            }
            function selectWeapon(index, isPlace) {
                if (!isPlace) {
                    player.weaponCode = index;
                }
                packet("G", index, 1);
            }
            function sendAutoGather() {
                packet("K", 1, 1);
            }
            function sendAtck(id, angle) {
                packet("d", id, angle, 1);
            }
            function toRadian(angle) {
                let fixedAngle = (angle % 360) * (Math.PI / 180);
                return fixedAngle < 0 ? (2 * Math.PI + fixedAngle) : fixedAngle;
            }

            function place(id, rad, rmd) {
                try {
                    if (id == undefined) return;
                    let item = items.list[player.items[id]];
                    let tmpS = player.scale + item.scale + (item.placeOffset || 0);
                    let tmpX = player.x2 + tmpS * Math.cos(rad);
                    let tmpY = player.y2 + tmpS * Math.sin(rad);
                    if (id === 0 || testMode || (player.alive && inGame && player.itemCounts[item.group.id] == undefined ? true : player.itemCounts[item.group.id] < (config.isSandbox ? id === 3 || id === 5 ? 299 : 99 : item.group.limit ? item.group.limit : 99))) {
                        selectToBuild(player.items[id]);
                        sendAtck(1, rad);
                        selectWeapon(player.weaponCode, 1);
                        if ((rmd || id) && configs4.RenderPl) {
                            placeVisible.push({
                                x: tmpX,
                                y: tmpY,
                                name: item.name,
                                scale: item.scale,
                                dir: rad
                            });
                            game.tickBase(() => {
                                placeVisible.shift();
                            }, 1);
                        } else {
                            placeVisible.shift();
                        }
                    }
                } catch (e) { }
            }

            function getDist(e, t) {
                try {
                    return Math.hypot((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return Infinity;
                }
            }
            function getDir(e, t) {
                try {
                    return Math.atan2((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return 0;
                }
            }
            function sortFromSmallest(arr, func) {
                func = typeof func == "function" ? func : (obj) => {
                    return obj
                };
                return arr.sort((two, one) => (func(two)) - func(one));
            }
            function getCloseBuildings() {
                let buildings = [];
                let addedBefore = {};
                let filteredBuildings = objectManager.getGridArrays(player.x, player.y, 200);
                for (var x = 0; x < filteredBuildings.length; ++x) {
                    for (var y = 0; y < filteredBuildings[x].length; ++y) {
                        if (filteredBuildings[x][y].active) {
                            buildings.push(filteredBuildings[x][y]);
                        }
                    }
                }
                return buildings;
            }
            function quadSpikeBreak(user, item) {
                try {
                    let angles = [];
                    let possibleOnes = [];
                    for (let angle = 0; angle < 72; angle++) {
                        angles.push(toRadian(angle * 5));
                    }
                    let buildings_ = sortFromSmallest(gameObjects.filter(t => t.active && t.sid != player.inTrap.sid && getDist(player, t) <= 150), (a)=>{
                        return getDist(player, a);
                    });
                    let last = null;
                    for (let angle of angles) {
                        let position = player.buildItemPosition(item, angle);
                        let possibleToPlace = true;
                        if (18 != item.id && position.y >= config.mapScale / 2 - config.riverWidth / 2 && position.y <= config.mapScale / 2 + config.riverWidth / 2) {
                            possibleToPlace = false;
                        } else if(last && getDist(last, position) < item.scale + (last.blocker ? last.blocker : last.getScale(0.6, last.isItem))){
                            possibleToPlace = false;
                        } else {
                            for (let building of buildings_) {
                                let range = building.blocker ? building.blocker : building.getScale(0.6, building.isItem);
                                if (getDist(building, position) < item.scale + range) {
                                    possibleToPlace = false;
                                    last = building;
                                    break;
                                }
                            }
                        }
                        if (possibleToPlace) {
                            possibleOnes.push(angle);
                        }
                    }
                    return possibleOnes;
                } catch (e) {
                }
            }
            function getPlaceablePositions(user, item) {
                try {
                    let angles = [];
                    let possibleOnes = [];
                    for (let angle = 0; angle < 72; angle++) {
                        angles.push(toRadian(angle * 5));
                    }
                    let buildings_ = [];
                    if (!window.isMohMoh) {
                        buildings_ = sortFromSmallest(gameObjects.filter(t => t.active && getDist(player, t) <= 150), (a)=>{
                            return getDist(player, a);
                        });
                    }
                    let last = null;
                    for (let angle of angles) {
                        let position = player.buildItemPosition(item, angle);
                        let possibleToPlace = true;
                        if (18 != item.id && position.y >= config.mapScale / 2 - config.riverWidth / 2 && position.y <= config.mapScale / 2 + config.riverWidth / 2) {
                            possibleToPlace = false;
                        } else if(last && getDist(last, position) < item.scale + (last.blocker ? last.blocker : last.getScale(0.6, last.isItem))){
                            possibleToPlace = false;
                        } else if (true) {
                            for (let building of buildings_) {
                                let range = building.blocker ? building.blocker : building.getScale(0.6, building.isItem);
                                if (getDist(building, position) < item.scale + range) {
                                    possibleToPlace = false;
                                    last = building;
                                    break;
                                }
                            }
                        }
                        if (possibleToPlace) {
                            possibleOnes.push(angle);
                        }
                    }
                    return possibleOnes;
                } catch (e) {
                }
            }
            let firstCheckPlaceForntiBUg = false;
            function simplePlace(id, radian) {
                checkPlace(id, radian);
            };


            function checkPlace(id, rad) {
                try {
                    if (secPacket.count >= 80) return;
                    let item = items.list[player.items[id]];
                    let tmpS = player.scale + item.scale + (item.placeOffset || 0);
                    let tmpX = player.x2 + tmpS * Math.cos(rad);
                    let tmpY = player.y2 + tmpS * Math.sin(rad);
                    if (objectManager.checkItemLocation(tmpX, tmpY, item.scale, 0.6, item.id, false, player)) {
                        place(id, rad, 1);
                    }
                } catch (e) {}
            }
            function soldierMult() {
                return player.skinIndex == 6 ? 0.75 : 1;
            }
            function getAttacker(damaged) {
                let attackers = enemy.filter(tmp => {
                    let damages = new Damages(items);
                    let dmg = damages.weapons[tmp.weaponIndex];
                    let by = tmp.weaponIndex < 9 ? [dmg[0], dmg[1], dmg[2], dmg[3]] : [dmg[0], dmg[1]];
                    let rule = {
                        one: tmp.dist2 <= 300,
                        two: by.includes(damaged),
                        three: tmp.attacked
                    }
                    return rule.one && rule.two && rule.three;
                });
                return attackers;
            }
            function healer() {
                for (let i = 0; i < healthBased(); i++) {
                    place(0, getAttackDir());
                }
            }
            function applCxC(value) {
                if (player.health == 100)
                    return 0;
                if (player.skinIndex != 45) {
                    return Math.ceil(value / items.list[player.items[0]].healing);
                }
                return 0;
            }
            function healthBased() {
                if (player.health == 100)
                    return 0;
                if (player.skinIndex != 45) {
                    return Math.ceil((100 - player.health) / items.list[player.items[0]].healing);
                }
                return 0;
            }
            function calcDmg(value) {
                return value * player.skinIndex == 6 ? 0.75 : 1;
            }
            function predictHeal() { }
            function antiSyncHealing(timearg) {
                my.antiSync = true;
                let healAnti = setInterval(() => {
                    if (player.shameCount < 5) {
                        place(0, getAttackDir());
                    }
                }, 75);
                setTimeout(() => {
                    clearInterval(healAnti);
                    setTimeout(() => {
                        my.antiSync = false;
                    }, game.tickRate);
                }, game.tickRate);
            }
            const placedSpikePositions = new Set();
            const placedTrapPositions = new Set();
            function isPositionValid(position) {
                const playerX = player.x2;
                const playerY = player.y2;
                const distToPosition = Math.hypot(position[0] - playerX, position[1] - playerY);
                return distToPosition > 35;
            }
            function findAllianceBySid(sid) {
                return player.team ? alliancePlayers.find((THIS) => THIS === sid) : null;
            }
            function calculatePossibleTrapPositions(x, y, radius) {
                const trapPositions = [];
                const numPositions = 16;
                for (let i = 0; i < numPositions; i++) {
                    const angle = (2 * Math.PI * i) / numPositions;
                    const offsetX = x + radius * Math.cos(angle);
                    const offsetY = y + radius * Math.sin(angle);
                    const position = [offsetX, offsetY];
                    if (!trapPositions.some((pos) => isPositionTooClose(position, pos))) {
                        trapPositions.push(position);
                    }
                }
                return trapPositions;
            }
            function isPositionTooClose(position1, position2, minDistance = 50) {
                const dist = Math.hypot(position1[0] - position2[0], position1[1] - position2[1]);
                return dist < minDistance;
            }
            function biomeGear(mover, returns) {
                if (player.y2 >= config.mapScale / 2 - config.riverWidth / 2 && player.y2 <= config.mapScale / 2 + config.riverWidth / 2) {
                    if (returns) return 31;
                    buyEquip(31, 0);
                } else {
                    if(getEl("defensemode").value == "empmode") {
                        if (player.y2 <= config.snowBiomeTop) {
                            if (returns) return mover && player.moveDir == undefined ? 22 : 15;
                            buyEquip(mover && player.moveDir == undefined ? 22 : 15, 0);
                        } else {
                            if (returns) return mover && player.moveDir == undefined ? 6 : 12;
                            buyEquip(mover && player.moveDir == undefined ? 22 : 12, 0);
                        }
                    } else {
                        if(!enemy.length) {
                            if (player.y2 <= config.snowBiomeTop) {
                                if (returns) return mover && player.moveDir == undefined ? 6 : 15;
                                buyEquip(mover && player.moveDir == undefined ? 6 : 15, 0);
                            } else {
                                if (returns) return mover && player.moveDir == undefined ? 6 : 12;
                                buyEquip(mover && player.moveDir == undefined ? 6 : 12, 0);
                            }
                        } else {
                            buyEquip(6, 0);
                        }
                    }
                }
                if (returns) return 0;
            }
            function woah(mover) {
                buyEquip(mover && player.moveDir == undefined ? 0 : tails, 1);
            }
            let advHeal = [];
            class Traps {
                constructor(UTILS, items) {
                    this.dist = 0;
                    this.aim = 0;
                    this.inTrap = false;
                    this.replaced = false;
                    this.antiTrapped = false;
                    this.info = {};
                    this.notFast = function() {
                        return player.weapons[1] == 10 && ((this.info.health > items.weapons[player.weapons[0]].dmg) || player.weapons[0] == 5);
                    }
                    this.testCanPlace = function (id, first = -(Math.PI / 2), repeat = (Math.PI / 2), plus = (Math.PI / 18), radian, replacer, yaboi) {
                        try {
                            let item = items.list[player.items[id]];
                            let tmpS = player.scale + item.scale + (item.placeOffset || 0);
                            let counts = {
                                attempts: 0,
                                placed: 0
                            };
                            let tmpObjects = [];
                            gameObjects.forEach((p) => {
                                tmpObjects.push({
                                    x: p.x,
                                    y: p.y,
                                    active: p.active,
                                    blocker: p.blocker,
                                    scale: p.scale,
                                    isItem: p.isItem,
                                    type: p.type,
                                    colDiv: p.colDiv,
                                    getScale: function(sM, ig) {
                                        sM = sM||1;
                                        return this.scale * ((this.isItem||this.type==2||this.type==3||this.type==4)
                                                             ?1:(0.6*sM)) * (ig?1:this.colDiv);
                                    },
                                });
                            });
                            for (let i = first; i < repeat; i += plus) {
                                counts.attempts++;
                                let relAim = radian + i;
                                let tmpX = player.x2 + tmpS * Math.cos(relAim);
                                let tmpY = player.y2 + tmpS * Math.sin(relAim);
                                let cantPlace = tmpObjects.find((tmp) => tmp.active && UTILS.getDistance(tmpX, tmpY, tmp.x, tmp.y) < item.scale + (tmp.blocker ? tmp.blocker : tmp.getScale(0.6, tmp.isItem)));
                                if (cantPlace) continue;
                                if (item.id != 18 && tmpY >= config.mapScale / 2 - config.riverWidth / 2 && tmpY <= config.mapScale / 2 + config.riverWidth / 2) continue;
                                if (yaboi.inTrap) {
                                    if (UTILS.getAngleDist(near.aim2 + Math.PI, relAim + Math.PI) <= Math.PI) {
                                        place(2, relAim, 1);
                                    } else {
                                        player.items[4] == 15 && place(4, relAim, 1);
                                    }
                                } else {
                                    if (UTILS.getAngleDist(near.aim2, relAim) <= config.gatherAngle / 1.5) {
                                        place(2, relAim, 1);
                                    } else {
                                        player.items[4] == 15 && place(4, relAim, 1);
                                    }
                                }
                                tmpObjects.push({
                                    x: tmpX,
                                    y: tmpY,
                                    active: true,
                                    blocker: item.blocker,
                                    scale: item.scale,
                                    isItem: true,
                                    type: null,
                                    colDiv: item.colDiv,
                                    getScale: function() {
                                        return this.scale;
                                    },
                                });
                                if (UTILS.getAngleDist(near.aim2, relAim) <= 1) {
                                    counts.placed++;
                                }
                            }
                            if (counts.placed > 0 && replacer && item.dmg) {
                                if (near.dist2 <= items.weapons[player.weapons[0]].range + (player.scale * 1.8)) {
                                    instaC.canSpikeTick = true;
                                }
                            }
                        } catch (err) {
                        }
                    };
                    this.checkSpikeTick = function() {
                        try {
                            if (![3, 4, 5].includes(near.primaryIndex)) return false;
                            if (near.primaryIndex == undefined ? true : (near.reloads[near.primaryIndex] > game.tickRate)) return false;
                            if (near.dist2 <= items.weapons[near.primaryIndex || 5].range + (near.scale * 1.8)) {
                                let item = items.list[9];
                                let tmpS = near.scale + item.scale + (item.placeOffset || 0);
                                let danger = 0;
                                let counts = {
                                    attempts: 0,
                                    block: `unblocked`
                                };
                                for (let i = -1; i <= 1; i += 1 / 10) {
                                    counts.attempts++;
                                    let relAim = UTILS.getDirect(player, near, 2, 2) + i;
                                    let tmpX = near.x2 + tmpS * Math.cos(relAim);
                                    let tmpY = near.y2 + tmpS * Math.sin(relAim);
                                    let cantPlace = gameObjects.find((tmp) => tmp.active && UTILS.getDistance(tmpX, tmpY, tmp.x, tmp.y) < item.scale + (tmp.blocker ? tmp.blocker : tmp.getScale(0.6, tmp.isItem)));
                                    if (cantPlace) continue;
                                    if (tmpY >= config.mapScale / 2 - config.riverWidth / 2 && tmpY <= config.mapScale / 2 + config.riverWidth / 2) continue;
                                    danger++;
                                    counts.block = `blocked`;
                                    break;
                                }
                                if (danger) {
                                    my.anti0Tick = 1;
                                    player.chat.count = 2000;
                                    return true;
                                }
                            }
                        } catch (err) {
                            return null;
                        }
                        return false;
                    }
                    this.AutoPlaceTrap = function() {
                        const trap1 = gameObjects
                        .filter((e) => e.trap && e.active)
                        .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2))
                        .find((trap) => {
                            const trapDist = Math.hypot(trap.y - near.y2, trap.x - near.x2);
                            return (
                                trap !== player &&
                                (player.sid === trap.owner.sid || findAllianceBySid(trap.owner.sid)) &&
                                trapDist <= 50
                            );
                        });
                        if(traps.info.health > items.weapons[player.weaponIndex].dmg ? true : false) {
                            if(traps.inTrap && !instaC.isTrue) {
                                if(player.weapons[1] == 10 ? player.reloads[player.weapons[1]] != 0 : player.reloads[player.weapons[0]] != 0) {
                                    if(near.dist2 < 400 && enemy.length) {
                                        for(let i = 0; i < 3; i++) {
                                            for (let i = Math.PI / 1.5; i < Math.PI * 2; i += Math.PI / 1.5) {
                                                checkPlace(2, near.aim2 + i);
                                            }
                                        }
                                    } else if(near.dist2 >= 400 && enemy.length) {
                                        for (let i = Math.PI / 1.5; i < Math.PI * 2; i += Math.PI / 1.5) {
                                            if(player.items[4] == 15) {
                                                checkPlace(4, near.aim2 + i);
                                            } else {
                                                checkPlace(2, near.aim2 + i);
                                            }
                                        }
                                    } else if(!enemy.length && traps.inTrap && !instaC.isTrue) {
                                        for (let i = Math.PI / 1.5; i < Math.PI * 2; i += Math.PI / 1.5) {
                                            checkPlace(3, i);
                                        }
                                    }
                                }
                            }
                        }
                    };
                    this.protect = function (aim) {
                    };
                    this.ReTrap = function() {
                        let range = items.weapons[player.weaponIndex].range + 70;
                        gameObjects.forEach(tmpObj => {
                            if(enemy.length) {
                                let objDst = UTILS.getDist(tmpObj, player, 0, 2);
                                let perfectAngle = UTILS.getDirect(tmpObj, player, 0, 2);
                                game.tickBase(() => {
                                    if (near.dist2 <= range && tmpObj.health <= 272.58 && PrePlaceCount < 15 && fgdo(tmpObj, player) <= range || ((near.length && near.reloads[near.weaponIndex] <= config.tickRate * (window.pingTime >= 200 ? 2 : 1)) || player.reloads[player.weaponIndex]*1000 <= config.tickRate * (window.pingTime >= 200 ? 2 : 1))) {
                                        place(2, perfectAngle);
                                        PrePlaceCount++;

                                    } else if (near.dist2 > range && tmpObj.health <= 272.58 && PrePlaceCount >= 0 && fgdo(tmpObj, player) <= range || ((near.length && near.reloads[near.weaponIndex] <= config.tickRate * (window.pingTime >= 200 ? 2 : 1)) || player.reloads[player.weaponIndex]*1000 <= config.tickRate * (window.pingTime >= 200 ? 2 : 1))) {
                                        PrePlaceCount--;
                                    }
                                }, 1);
                            }
                        });
                    }

                    let placedSpikePositions = new Set();
                    let placedTrapPositions = new Set();

                    this.autoPlace = function () {
                        try {
                            if (configs.autoPlace) {
                                const nearEnemyDist2 = near.dist2;
                                const trap1 = gameObjects
                                .filter((e) => e.trap && e.active)
                                .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2))
                                .find((trap) => {
                                    const trapDist = Math.hypot(trap.y - near.y2, trap.x - near.x2);
                                    return (
                                        trap !== player &&
                                        (player.sid === trap.owner.sid || findAllianceBySid(trap.owner.sid)) &&
                                        trapDist <= 50
                                    );
                                });
                                if (trap1 && nearEnemyDist2 <= 160) {
                                    const trapX = trap1.x;
                                    const trapY = trap1.y;
                                    const circleRadius = 102;
                                    const numPositions = 64;
                                    for (let i = 0; i < numPositions; i++) {
                                        const angle = (2 * Math.PI * i) / numPositions;
                                        const offsetX = trapX + circleRadius * Math.cos(angle);
                                        const offsetY = trapY + circleRadius * Math.sin(angle);
                                        const position = [offsetX, offsetY];
                                        const distToPlayer = Math.hypot(position[0] - player.x2, position[1] - player.y2);
                                        if (
                                            !placedSpikePositions.has(JSON.stringify(position)) &&
                                            isPositionValid(position) &&
                                            distToPlayer <= 87
                                        ) {
                                            const angleToPlace = Math.atan2(position[1] - player.y2, position[0] - player.x2);
                                            checkPlace(2, angleToPlace);
                                            placedSpikePositions.add(JSON.stringify(position));
                                        }
                                    }
                                } else if (!trap1 && nearEnemyDist2 <= 206) {
                                    placedSpikePositions.clear();
                                    const maxTrapsToPlace = 3;
                                    const trapRadius = 50;
                                    const trapPositions = calculatePossibleTrapPositions(player.x2, player.y2, trapRadius);
                                    let trapsPlaced = 0;
                                    for (const position of trapPositions) {
                                        if (
                                            trapsPlaced < maxTrapsToPlace &&
                                            !placedTrapPositions.has(JSON.stringify(position)) &&
                                            isPositionValid(position)
                                        ) {
                                            checkPlace(4, ...position);
                                            placedTrapPositions.add(JSON.stringify(position));
                                            trapsPlaced++;
                                            checkPlace(2, near.aim2);
                                        }
                                    }
                                }
                            }
                        } catch (e) {}
                    };
                    this.replacer = function (findObj) {
                        const trap1 = gameObjects
                        .filter((e) => e.trap && e.active)
                        .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2))
                        .find((trap) => {
                            const trapDist = Math.hypot(trap.y - near.y2, trap.x - near.x2);
                            return (
                                trap !== player &&
                                (player.sid === trap.owner.sid || findAllianceBySid(trap.owner.sid)) &&
                                trapDist <= 50
                            );
                        });
                        if (!findObj || !configs.autoReplace) return;
                        if (!inGame) return;
                        if (this.antiTrapped) return;
                        if (configs3.WeaponGrinder && objDst <= items.weapons[player.weaponIndex].range + player.scale) return;
                        let objDst = UTILS.getDist(findObj, player, 0, 2);
                        let objAim = UTILS.getDirect(findObj, player, 0, 2);
                        if (objDst <= 400 && near.dist2 <= 400) {
                            if (near.dist2 < 250) {
                                for(let i = 0; i < Math.PI*2;i += Math.PI/9){
                                    checkPlace(2, near.aim2 + i);
                                }
                            } else {
                                for(let i = 0; i < Math.PI*2;i += Math.PI/9){
                                    checkPlace(4, near.aim2 + i);
                                }
                            }
                            this.replaced = true;
                        }
                    };
                }
            };
            class Instakill {
                constructor() {
                    this.wait = false;
                    this.can = false;
                    this.isTrue = false;
                    this.nobull = false;
                    this.ticking = false;
                    this.canSpikeTick = false;
                    this.startTick = false;
                    this.readyTick = false;
                    this.canCounter = false;
                    this.syncHit = true;
                    this.changeType = function(type) {
                        this.wait = false;
                        this.isTrue = true;
                        my.autoAim = true;
                        buyEquip(18, 1);
                        game.tickBase(() => {
                            if (type == "rev") {
                                selectWeapon(player.weapons[1]);
                                buyEquip(53, 0);
                                sendAutoGather();
                                game.tickBase(() => {
                                    selectWeapon(player.weapons[0]);
                                    buyEquip(7, 0);
                                    game.tickBase(() => {
                                        sendAutoGather();
                                        this.isTrue = false;
                                        my.autoAim = false;
                                    }, 1);
                                }, 1);
                            } else if (type == "nobull") {
                                selectWeapon(player.weapons[0]);
                                buyEquip(6, 0);
                                sendAutoGather();
                                game.tickBase(() => {
                                    if (near.skinIndex == 22) {
                                        buyEquip(6, 0);
                                    } else {
                                        buyEquip(53, 0);
                                    }
                                    selectWeapon(player.weapons[1]);
                                    game.tickBase(() => {
                                        sendAutoGather();
                                        this.isTrue = false;
                                        my.autoAim = false;
                                    }, 1);
                                }, 1);
                            } else if (type == "normal") {
                                selectWeapon(player.weapons[0]);
                                buyEquip(7, 0);
                                sendAutoGather();
                                game.tickBase(() => {
                                    selectWeapon(player.weapons[1]);
                                    buyEquip(53, 0);
                                    game.tickBase(() => {
                                        sendAutoGather();
                                        this.isTrue = false;
                                        my.autoAim = false;
                                    }, 1);
                                }, 1);
                            } else {
                                setTimeout(() => {
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, 70);
                            }
                        }, 1);
                    };
                    this.SyncHitType = function () {
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(Wings, 1);
                        buyEquip(7, 0);
                        sendAutoGather();
                        game.tickBase(() => {
                            if (player.reloads[53] == 0) {
                                selectWeapon(player.weapons[0]);
                                buyEquip(Wings, 1);
                                buyEquip(6, 0);
                                game.tickBase(() => {
                                    buyEquip(6, 0);
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, 1);
                            } else {
                                buyEquip(6, 0);
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                            }
                        }, 1);
                    };
                    this.spikeTickType = function () {
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(Wings, 1);
                        buyEquip(7, 0);
                        sendAutoGather();
                        game.tickBase(() => {
                            if (player.reloads[53] == 0) {
                                selectWeapon(player.weapons[0]);
                                buyEquip(Wings, 1);
                                buyEquip(53, 0);
                                game.tickBase(() => {
                                    buyEquip(6, 0);
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, 1);
                            } else {
                                buyEquip(6, 0);
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                            }
                        }, 1);
                    };
                    this.syncTry = function() {
                        if (player.weapons[1] == 15) {
                            if (getEl("synctype").value == "longsync") {
                                this.isTrue = true;
                                my.autoAim = true;
                                buyEquip(29, 0);
                                game.tickBase(() => {
                                    buyEquip(1, 0);
                                }, 1);
                                game.tickBase(() => {
                                    buyEquip(53, 0);
                                }, 2);
                                game.tickBase(() => {
                                    instaC.isTrue = true;
                                    selectWeapon(player.weapons[1]);
                                    buyEquip(18, 1);
                                    if(player.skins[20]) {
                                        buyEquip(20, 0);
                                    } else {
                                        buyEquip(1, 0);
                                    }
                                    sendAutoGather();
                                    game.tickBase(() => {
                                        if(player.skins[20]) {
                                            buyEquip(20, 0);
                                        } else {
                                            buyEquip(1, 0);
                                        }
                                        selectWeapon(player.weapons[0]);
                                        my.autoAim = false;
                                        instaC.isTrue = false;
                                        this.isTrue = false;
                                        sendAutoGather();
                                    }, 1);
                                }, 4);
                            } else {
                                this.isTrue = true;
                                my.autoAim = true;
                                buyEquip(53, 0);
                                game.tickBase(() => {
                                    instaC.isTrue = true;
                                    selectWeapon(player.weapons[1]);
                                    buyEquip(18, 1);
                                    sendAutoGather();
                                    game.tickBase(() => {
                                        selectWeapon(player.weapons[0]);
                                        my.autoAim = false;
                                        instaC.isTrue = false;
                                        this.isTrue = false;
                                        sendAutoGather();
                                    }, 1);
                                }, 2);
                            }
                        }
                    };
                    this.counterType = function() {
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(7, 0);
                        buyEquip(Wings, 1);
                        sendAutoGather();
                        game.tickBase(() => {
                            buyEquip(7, 0);
                            if (player.reloads[53] == 0) {
                                buyEquip(53, 0);
                                selectWeapon(player.weapons[0]);
                                buyEquip(53, 0);
                                buyEquip(Wings, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, 1);
                            } else {
                                buyEquip(7, 0);
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                            }
                        }, 1);
                    };
                    this.bowInsta = function(type) {
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[1]);
                        sendAutoGather();
                        sendUpgrade(38);
                        buyEquip(53, 0);
                        buyEquip(19, 1);
                        game.tickBase(() => {
                            sendUpgrade(12);
                            selectWeapon(player.weapons[1]);
                            buyEquip(1, 0);
                            buyEquip(19, 1);
                            game.tickBase(() => {
                                sendUpgrade(15);
                                selectWeapon(player.weapons[1]);
                                buyEquip(1, 0);
                                buyEquip(19, 1);
                                game.tickBase(() => {
                                    sendAutoGather();
                                    this.isTrue = false;
                                    my.autoAim = false;
                                }, 1);
                            }, 1);
                        }, 1);
                    };
                    this.spikeTickType = function() {
                        this.isTrue = true;
                        my.autoAim = true;
                        selectWeapon(player.weapons[0]);
                        buyEquip(7, 0);
                        buyEquip(Wings, 1);
                        sendAutoGather();
                        game.tickBase(() => {
                            buyEquip(7, 0);
                            selectWeapon(player.weapons[0]);
                            buyEquip(53, 0);
                            buyEquip(53, 0);
                            buyEquip(Wings, 1);
                            game.tickBase(() => {
                                sendAutoGather();
                                this.isTrue = false;
                                my.autoAim = false;
                                buyEquip(Soldier, 0);
                            }, 3);
                        }, 1);
                    },
                        this.perfCheck = function(pl, nr) {
                        if(nr.weaponIndex == 7) {
                            Soldier = 26;
                        } else {
                            Soldier = 6
                        }
                        if (nr.weaponIndex == 11 && UTILS.getAngleDist(nr.aim2 + Math.PI, nr.d2) <= config.shieldAngle) return false;
                        if (![9, 12, 13, 15].includes(player.weapons[1])) return true;
                        let pjs = {
                            x: nr.x2 + (70 * Math.cos(nr.aim2 + Math.PI)),
                            y: nr.y2 + (70 * Math.sin(nr.aim2 + Math.PI))
                        };
                        if (UTILS.lineInRect(pl.x2 - pl.scale, pl.y2 - pl.scale, pl.x2 + pl.scale, pl.y2 + pl.scale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                            return true;
                        }
                        let finds = ais.filter(tmp => tmp.visible).find((tmp) => {
                            if (UTILS.lineInRect(tmp.x2 - tmp.scale, tmp.y2 - tmp.scale, tmp.x2 + tmp.scale, tmp.y2 + tmp.scale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                                return true;
                            }
                        });
                        if (finds) return false;
                        finds = gameObjects.filter(tmp => tmp.active).find((tmp) => {
                            let tmpScale = tmp.getScale();
                            if (!tmp.ignoreCollision && UTILS.lineInRect(tmp.x - tmpScale, tmp.y - tmpScale, tmp.x + tmpScale, tmp.y + tmpScale, pjs.x, pjs.y, pjs.x, pjs.y)) {
                                return true;
                            }
                        });
                        if (finds) return false;
                        return true;
                    }
                }
            };
            class Autobuy {
                constructor(buyHat, buyAcc) {
                    this.hat = function() {
                        buyHat.forEach((id) => {
                            let find = findID(hats, id);
                            if (find && !player.skins[id] && player.points >= find.price) packet("c", 1, id, 0);
                        });
                    };
                    this.acc = function() {
                        buyAcc.forEach((id) => {
                            let find = findID(accessories, id);
                            if (find && !player.tails[id] && player.points >= find.price) packet("c", 1, id, 1);
                        });
                    };
                }
            };
            class Autoupgrade {
                constructor() {
                    this.sb = function(upg) {
                        upg(3);
                        upg(17);
                        upg(31);
                        upg(23);
                        upg(9);
                        upg(38);
                    };
                    this.kh = function(upg) {
                        upg(3);
                        upg(17);
                        upg(31);
                        upg(23);
                        upg(10);
                        upg(38);
                        upg(4);
                        upg(25);
                    };
                    this.pb = function(upg) {
                        upg(5);
                        upg(17);
                        upg(32);
                        upg(23);
                        upg(9);
                        upg(38);
                    };
                    this.ph = function(upg) {
                        upg(5);
                        upg(17);
                        upg(32);
                        upg(23);
                        upg(10);
                        upg(38);
                        upg(28);
                        upg(25);
                    };
                    this.db = function(upg) {
                        upg(7);
                        upg(17);
                        upg(31);
                        upg(23);
                        upg(9);
                        upg(34);
                    };
                    this.km = function(upg) {
                        upg(3);
                        upg(17);
                        upg(31);
                        upg(23);
                        upg(10);
                        upg(38);
                        upg(4);
                        upg(15);
                    };
                };
            };
            class Damages {
                constructor(items) {
                    this.calcDmg = function(dmg, val) {
                        return dmg * val;
                    };
                    this.getAllDamage = function(dmg) {
                        return [this.calcDmg(dmg, 0.75), dmg, this.calcDmg(dmg, 1.125), this.calcDmg(dmg, 1.5)];
                    };
                    this.weapons = [];
                    for (let i = 0; i < items.weapons.length; i++) {
                        let wp = items.weapons[i];
                        let name = wp.name.split(" ").length <= 1 ? wp.name : (wp.name.split(" ")[0] + "_" + wp.name.split(" ")[1]);
                        this.weapons.push(this.getAllDamage(i > 8 ? wp.Pdmg : wp.dmg));
                        this[name] = this.weapons[i];
                    }
                }
            }
            let tmpList = [];
            let UTILS = new Utils();
            let items = new Items();
            let objectManager = new Objectmanager(GameObject, gameObjects, UTILS, config);
            let store = new Store();
            let hats = store.hats;
            let accessories = store.accessories;
            let projectileManager = new ProjectileManager(Projectile, projectiles, players, ais, objectManager, items, config, UTILS);
            let aiManager = new AiManager(ais, AI, players, items, null, config, UTILS);
            let textManager = new Textmanager();
            let traps = new Traps(UTILS, items);
            let instaC = new Instakill();
            let autoBuy = new Autobuy([40, 15, 31, 6, 7], [11, 21]);
            let autoUpgrade = new Autoupgrade();
            let lastDeath;
            let minimapData;
            let mapMarker = {};
            let mapPings = [];
            let tmpPing;
            let breakTrackers = [];
            let pathFindTest = 0;
            let grid = [];
            let pathFind = {
                active: true,
                grid: 8,
                scale: 40,
                x: 14400,
                y: 14400,
                chaseNear: false,
                array: [],
                lastX: this.grid / 2,
                lastY: this.grid / 2
            };
            function sendChat(message) {
                packet("6", message.slice(0, 30));
            }
            let runAtNextTick = [];
            function checkProjectileHolder(x, y, dir, range, speed, indx, layer, sid) {
                let weaponIndx = indx == 0 ? 9 : indx == 2 ? 12 : indx == 3 ? 13 : indx == 5 && 15;
                let projOffset = config.playerScale * 2;
                let projXY = {
                    x: indx == 1 ? x : x - projOffset * Math.cos(dir),
                    y: indx == 1 ? y : y - projOffset * Math.sin(dir),
                };
                let nearPlayer = players.filter((e) => e.visible && UTILS.getDist(projXY, e, 0, 2) <= e.scale).sort(function(a, b) {
                    return UTILS.getDist(projXY, a, 0, 2) - UTILS.getDist(projXY, b, 0, 2);
                })[0];
                if (nearPlayer) {
                    if (indx == 1) {
                        nearPlayer.shooting[53] = 1;
                    } else {
                        nearPlayer.shootIndex = weaponIndx;
                        nearPlayer.shooting[1] = 1;
                        antiProj(nearPlayer, dir, range, speed, indx, weaponIndx);
                    }
                }
            }
            let projectileCount = 0;
            let Tail = 11;
            let tails;
            let Wings = 0;
            function antiProj(tmpObj, dir, range, speed, index, weaponIndex) {
                if (!tmpObj.isTeam(player)) {
                    tmpDir = UTILS.getDirect(player, tmpObj, 2, 2);
                    if (UTILS.getAngleDist(tmpDir, dir) <= 0.2) {
                        tmpObj.bowThreat[weaponIndex]++;
                        if (index == 5) {
                            projectileCount++;
                        }
                        setTimeout(() => {
                            tmpObj.bowThreat[weaponIndex]--;
                            if (index == 5) {
                                projectileCount--;
                            }
                        }, range / speed);
                        if (tmpObj.bowThreat[9] >= 1 && (tmpObj.bowThreat[12] >= 1 || tmpObj.bowThreat[15] >= 1)) {
                            place(1, tmpObj.aim2);
                            my.anti0Tick = 4;
                            if (!my.antiSync) {
                                io.send("6", "sync is homo");
                                antiSyncHealing(4);
                            }
                        } else {
                            if (projectileCount >= 2) {
                                place(1, tmpObj.aim2);
                                my.anti0Tick = 4;
                                if (!my.antiSync) {
                                    io.send("6", "sync is homo");
                                    antiSyncHealing(4);
                                }
                            }
                        }
                    }
                }
            }
            function showItemInfo(item, isWeapon, isStoreItem) {
                if (player && item) {
                    UTILS.removeAllChildren(itemInfoHolder);
                    itemInfoHolder.classList.add("visible");
                    itemInfoHolder.remove();
                    UTILS.generateElement({
                        id: "itemInfoName",
                        text: UTILS.capitalizeFirst(item.name),
                        parent: itemInfoHolder
                    });
                    UTILS.generateElement({
                        id: "itemInfoDesc",
                        text: item.desc,
                        parent: itemInfoHolder
                    });
                    if (isStoreItem) {
                    } else if (isWeapon) {
                        UTILS.generateElement({
                            class: "itemInfoReq",
                            text: !item.type ? "primary" : "secondary",
                            parent: itemInfoHolder
                        });
                    } else {
                        for (let i = 0; i < item.req.length; i += 2) {
                            UTILS.generateElement({
                                class: "itemInfoReq",
                                html: item.req[i] + "<span class='itemInfoReqVal'> x" + item.req[i + 1] + "</span>",
                                parent: itemInfoHolder
                            });
                        }
                        if (item.group.limit) {
                            UTILS.generateElement({
                                class: "itemInfoLmt",
                                text: (player.itemCounts[item.group.id] || 0) + "/" + (config.isSandbox ? 99 : item.group.limit),
                                parent: itemInfoHolder
                            });
                        }
                    }
                } else {
                    itemInfoHolder.classList.remove("visible");
                }
            }
            window.addEventListener("resize", UTILS.checkTrusted(resize));
            function resize() {
                screenWidth = window.innerWidth;
                screenHeight = window.innerHeight;
                let scaleFillNative = Math.max(screenWidth / maxScreenWidth, screenHeight / maxScreenHeight) * pixelDensity;
                gameCanvas.width = screenWidth * pixelDensity;
                gameCanvas.height = screenHeight * pixelDensity;
                gameCanvas.style.width = screenWidth + "px";
                gameCanvas.style.height = screenHeight + "px";
                mainContext.setTransform(
                    scaleFillNative, 0,
                    0, scaleFillNative,
                    (screenWidth * pixelDensity - (maxScreenWidth * scaleFillNative)) / 2,
                    (screenHeight * pixelDensity - (maxScreenHeight * scaleFillNative)) / 2
                );
            }
            resize();
            const mals = document.getElementById('touch-controls-fullscreen');
            mals.style.display = 'block';
            mals.addEventListener("mousemove", gameInput, false);
            function gameInput(e) {
                mouseX = e.clientX;
                mouseY = e.clientY;
            }
            let clicks = {
                left: false,
                middle: false,
                right: false,
            };
            mals.addEventListener("mousedown", mouseDown, false);
            function mouseDown(e) {
                if (attackState != 1) {
                    attackState = 1;
                    if (e.button == 0) {
                        buyEquip(Wings, 1);
                        buyEquip(7, 0);
                        clicks.left = true;
                    } else if (e.button == 1) {
                        clicks.middle = true;
                    } else if (e.button == 2) {
                        buyEquip(Wings, 1);
                        buyEquip(40, 0);
                        clicks.right = true;
                    }
                }
            }
            mals.addEventListener("mouseup", UTILS.checkTrusted(mouseUp));
            function mouseUp(e) {
                if (attackState != 0) {
                    attackState = 0;
                    if (e.button == 0) {
                        buyEquip(Wings, 1);
                        buyEquip(7, 0);
                        clicks.left = false;
                    } else if (e.button == 1) {
                        clicks.middle = false;
                        my.autoAim = false;
                    } else if (e.button == 2) {
                        buyEquip(Wings, 1);
                        buyEquip(40, 0);
                        clicks.right = false;
                    }
                }
            }
            mals.addEventListener("wheel", wheel, false);
            function wheel(e) {
                if(configs6.Zoom) {
                    if(e.deltaY > 0){
                        maxScreenHeight *= 1.05;
                        maxScreenWidth *= 1.05;
                    } else {
                        maxScreenHeight /= 1.05;
                        maxScreenWidth /= 1.05;
                    }
                    resize();
                }
            }
            function getMoveDir() {
                let dx = 0;
                let dy = 0;
                for (let key in moveKeys) {
                    let tmpDir = moveKeys[key];
                    dx += !!keys[key] * tmpDir[0];
                    dy += !!keys[key] * tmpDir[1];
                }
                return dx == 0 && dy == 0 ? undefined : Math.atan2(dy, dx);
            }
            function getSafeDir() {
                if (!player)
                    return 0;
                if (!player.lockDir) {
                    lastDir = Math.atan2(mouseY - (screenHeight / 2), mouseX - (screenWidth / 2));
                }
                return lastDir || 0;
            }
            let plusDir = 0;
            let lastSpin = Date.now();
            function isNearPlayer() {
                return near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap;
            }
            function getAttackDir(debug) {
                if (debug) {
                    if (!player)
                        return "0";
                    if(configs4.RandomDir && !clicks.left && !my.autoAim && !traps.inTrap && !player.lockDir && !clicks.right) {
                        if((enemy.length && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale + 50 && (configs3.AutoBullSpam || config.autobot)) || (player.reloads[player.weapons[1]] != 0 && player.weapons[1] && player.weapons[1] != 10)) {
                            getdir();
                        } else {
                            lastDir = "getSafeDir()";
                        }
                    } else if (my.autoAim || (isNearPlayer() && clicks.left && player.reloads[player.weapons[0]] == 0)) {
                        if((configs4.RandomDir) && clicks.left) {
                            lastDir = "getSafeDir()";
                        } else {
                            lastDir = configs3.WeaponGrinder ? "getSafeDir()" : enemy.length ? my.revAim ? "(near.aim2 + Math.PI)" : "near.aim2" : "getSafeDir()";
                        }
                    } else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
                        lastDir = "getSafeDir()";
                    } else if (traps.inTrap && !AntiBull && !clicks.left && !clicks.right && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0) {
                        lastDir = "traps.aim";
                    } else if (!player.lockDir) {
                        if (((configs4.RandomDir && !traps.inTrap && enemy.length) && !clicks.left && !clicks.right) || (configs2.TrapAim && traps.inTrap && !clicks.left && !clicks.right && !clicks.middle)) return "undefined";
                        lastDir = "getSafeDir()";
                    }

                    if(noDirMy) {
                        if(!clicks.left && !my.autoAim && !traps.inTrap && !player.lockDir && !clicks.right) {
                        } else {
                            return lastDir;
                        }
                    } else {
                        return lastDir;
                    }
                } else {
                    if (!player)
                        return 0;
                    if(configs4.RandomDir && !clicks.left && !clicks.right && !my.autoAim && !traps.inTrap && !player.lockDir) {
                        if((enemy.length && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale + 50 && (configs3.AutoBullSpam || config.autobot)) || (player.reloads[player.weapons[1]] != 0 && player.weapons[1] && player.weapons[1] != 10)) {
                            getdir();
                        } else {
                            lastDir = getSafeDir();
                        }
                    } else if (my.autoAim || (isNearPlayer() && clicks.left && player.reloads[player.weapons[0]] == 0)) {
                        if(configs4.RandomDir && clicks.left) {
                            lastDir = getSafeDir();
                        } else {
                            lastDir = configs3.WeaponGrinder ? getSafeDir() : enemy.length ? my.revAim ? (near.aim2 + Math.PI) : near.aim2 : getSafeDir();
                        }
                    } else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
                        lastDir = getSafeDir();
                    } else if (traps.inTrap && !AntiBull && !clicks.left && !clicks.right && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0) {
                        lastDir = traps.aim;
                    } else if (!player.lockDir) {
                        if (((configs4.RandomDir && !traps.inTrap && enemy.length) && !clicks.left && !clicks.right) || (configs2.TrapAim && traps.inTrap && !clicks.left && !clicks.right && !clicks.middle)) return undefined;
                        lastDir = getSafeDir();
                    }

                    if(noDirMy) {
                        if(!clicks.left && !my.autoAim && !traps.inTrap && !player.lockDir && !clicks.right) {
                        } else {
                            return lastDir || 0;
                        }
                    } else {
                        return lastDir || 0;
                    }
                }
            }
            function getdir() {
                lastDir = Math.random() * Math.PI * 2;
            }
            function getVisualDir() {
                if (!player)
                    return 0;
                if(configs4.RandomDir && !clicks.left && enemy.length && !my.autoAim && !traps.inTrap && !player.lockDir && !clicks.right) {
                    if((enemy.length && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale + 50 && (configs3.AutoBullSpam || config.autobot)) || (player.reloads[player.weapons[1]] != 0 && player.weapons[1] && player.weapons[1] != 10)) {
                        getdir();
                    } else {
                        lastDir = getSafeDir();
                    }
                } else if (my.autoAim || (isNearPlayer() && clicks.left && player.reloads[player.weapons[0]] == 0)) {
                    if(configs4.RandomDir && clicks.left) {
                        lastDir = getSafeDir();
                    } else {
                        lastDir = configs3.WeaponGrinder ? getSafeDir() : enemy.length ? my.revAim ? (near.aim2 + Math.PI) : near.aim2 : getSafeDir();
                    }
                } else if (clicks.right && player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0) {
                    lastDir = getSafeDir();
                } else if (traps.inTrap && !AntiBull && !clicks.left && !clicks.right && player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0) {
                    lastDir = traps.aim;
                } else if (!player.lockDir) {
                    if(configs2.TrapAim && traps.inTrap && !clicks.left && !clicks.right && !clicks.middle) {
                    } else {
                        lastDir = getSafeDir();
                    }
                }

                if(noDirMy) {
                    if(!clicks.left && !my.autoAim && !traps.inTrap && !player.lockDir && !clicks.right) {
                    } else {
                        return lastDir || 0;
                    }
                } else {
                    return lastDir || 0;
                }
            }

            function keysActive() {
                return (allianceMenu.style.display != "block" &&
                        chatHolder.style.display != "block" &&
                        !menuCBFocus);
            }
            let noDirMy = false;
            let StoreB = document.getElementById('storeButton');
            $("#menuDiv").hide();
            function keyDown(event) {
                let keyNum = event.which || event.keyCode || 0;
                if (player && player.alive && keysActive()) {
                    if (!keys[keyNum]) {
                        keys[keyNum] = 1;
                        macro[event.key] = 1;
                        if (keyNum == 27) {
                            $("#menuChatDiv").hide();
                            $("#menuDiv").toggle();
                        } else if(keyNum == 82 && player.reloads[53] == 0 && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0 && !instaC.isTrue) {
                            instaType = false;
                            instaC.can = true;
                            game.tickBase(() => {
                                instaType = true;
                                instaC.can = false;
                            }, 2);
                        } else if(keyNum == 191) {
                            window.zoomvis();
                        } else if(keyNum == 188 && player.reloads[53] == 0 && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0 && !instaC.isTrue) {
                            instaC.bowInsta();
                        } else if(keyNum == 71) {
                            crossHair = crossHair ? false : true;
                        } else if(keyNum == 80 && configs.showDir) {
                            noDirMy = noDirMy ? false : true;
                        } else if (keyNum == 69) {
                            sendAutoGather();
                        } else if (keyNum == 222) {
                            instaC.testMovement();
                        } else if (keyNum == 67) {
                            updateMapMarker();
                        } else if (player.weapons[keyNum - 49] != undefined) {
                            player.weaponCode = player.weapons[keyNum - 49];
                        } else if (moveKeys[keyNum]) {
                            sendMoveDir();
                        } else if (event.key == "m") {
                            mills.placeSpawnPads = !mills.placeSpawnPads;
                        } else if (event.key == "q") {
                            io.send("6", "")
                            setTimeout(() => {
                                io.send("6", "")
                            }, 1000);
                        } else if (event.key == "v") {
                            io.send("6", "")
                        } else if (event.key == "f") {
                            io.send("6", "")
                        } else if (event.key == "h") {
                            io.send("6", "")
                        } else if (event.key == "y") {
                            io.send("6", "")
                        } else if (event.key == "z") {
                            mills.place = !mills.place;
                        }
                    }
                }
            }
            addEventListener("keydown", UTILS.checkTrusted(keyDown));
            function keyUp(event) {
                if (player && player.alive) {
                    let keyNum = event.which || event.keyCode || 0;
                    if (keysActive()) {
                        if (keys[keyNum]) {
                            keys[keyNum] = 0;
                            macro[event.key] = 0;
                            if (moveKeys[keyNum]) {
                                sendMoveDir();
                            }
                        }
                    }
                }
            }
            window.addEventListener("keyup", UTILS.checkTrusted(keyUp));
            function sendMoveDir() {
                let newMoveDir = getMoveDir();
                if (lastMoveDir == undefined || newMoveDir == undefined || Math.abs(newMoveDir - lastMoveDir) > 0.3) {
                    if (!my.autoPush && (!config.autobot || !enemy.length)) {
                        packet("a", newMoveDir, 1);
                    }
                    lastMoveDir = newMoveDir;
                    player.randDIff = Math.random * Math.PI * 2;
                }
            }
            function bindEvents() { }
            bindEvents();
            function chechPathColl(tmp) {
                return ((player.scale + tmp.getScale()) / (player.maxSpeed * items.weapons[player.weaponIndex].spdMult)) + (tmp.dmg && !tmp.isTeamObject(player) ? 35 : 0);
                return tmp.colDiv == 0.5 ? (tmp.scale * tmp.colDiv) :
                    !tmp.isTeamObject(player) && tmp.dmg ? (tmp.scale + player.scale) :
                tmp.isTeamObject(player) && tmp.trap ? 0 : tmp.scale;
            }
            function checkObject() {
                let checkColl = gameObjects.filter(tmp => player.canSee(tmp) && tmp.active);
                for (let y = 0; y < pathFind.grid; y++) {
                    grid[y] = [];
                    for (let x = 0; x < pathFind.grid; x++) {
                        let tmpXY = {
                            x: (player.x2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * x),
                            y: (player.y2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * y)
                        }
                        if (UTILS.getDist(pathFind.chaseNear ? near : pathFind, tmpXY, pathFind.chaseNear ? 2 : 0, 0) <= (pathFind.chaseNear ? 35 : 60)) {
                            pathFind.lastX = x;
                            pathFind.lastY = y;
                            grid[y][x] = 0;
                            continue;
                        }
                        let find = checkColl.find(tmp => UTILS.getDist(tmp, tmpXY, 0, 0) <= chechPathColl(tmp));
                        if (find) {
                            if (find.trap) {
                                grid[y][x] = 0;
                                continue;
                            }
                            grid[y][x] = 1;
                        } else {
                            grid[y][x] = 0;
                        }
                    }
                }
            }

            function toFancyTimeFormat(time) {
                let minutes = ~~((time % 3600) / 60);
                let seconds = ~~time % 60;
                if (seconds <= 9) seconds = `0${seconds}`;
                return `${minutes}:${seconds}`;
            }

            let cSp = false;
            function sn(m) {
                sendChat(m);
            }
            //intervalsGG
            let turretR;
            setInterval(() => {
                if (inGame) {
                    if(configs5.Packet) {
                        $("#packetStatus").show();
                    } else {
                        $("#packetStatus").hide();
                    }
                    if (instaC.ticking) {
                        instaC.ticking = false;
                    }
                    if (instaC.syncHit) {
                        instaC.syncHit = true;
                    }
                    if (my.anti0Tick > 0) {
                        my.anti0Tick--;
                    }
                    if (traps.antiTrapped) {
                        traps.antiTrapped = false;
                    }
                    if (traps.replaced) {
                        traps.replaced = false;
                    }
                }
                if(player && player.alive && inGame) {
                    if (audio.paused) {
                        playButton.textContent = "Play";
                        playButton.style.background = "green";
                    } else {
                        playButton.textContent = "Pause";
                        playButton.style.background = "red";
                    }
                    musicV = audio.paused ? 'Off' : 'On';
                    $("#gameUI").show();
                    if(menuDiv.style.display != 'none') {
                        upgradeHolder.style.display = "none";
                        upgradeCounter.style.display = "none";
                    }
                    //
                    if(player.skins[22]) {
                        $(".augh").css({
                            "background-color": "green",
                            'opacity': '0.7',
                        });
                    }
                    if(player.skins[7]) {
                        $(".augh1").css({
                            "background-color": "green",
                            'opacity': '0.7',
                        });
                    }
                    if(player.skins[6]) {
                        $(".augh2").css({
                            "background-color": "green",
                            'opacity': '0.7',
                        });
                    }
                    if(player.skins[40]) {
                        $(".augh3").css({
                            "background-color": "green",
                            'opacity': '0.7',
                        });
                    }
                    if(player.skins[21]) {
                        $(".augh4").css({
                            "background-color": "green",
                            'opacity': '0.7',
                        });
                    }
                    if(player.skins[12]) {
                        $(".augh5").css({
                            "background-color": "green",
                            'opacity': '0.7',
                        });
                    }
                    if(player.skins[56]) {
                        $(".augh6").css({
                            "background-color": "green",
                            'opacity': '0.7',
                        });
                    }
                    if(player.tails[19]) {
                        $(".augh7").css({
                            "background-color": "green",
                            'opacity': '0.7',
                        });
                    }
                    if(player.tails[18]) {
                        $(".augh8").css({
                            "background-color": "green",
                            'opacity': '0.7',
                        });
                    }
                    if(player.tails[21]) {
                        $(".augh9").css({
                            "background-color": "green",
                            'opacity': '0.7',
                        });
                    }
                    $("#killCounter").show();
                } else {
                    $("#killCounter").hide();
                }
                if(player && player.alive && menuDiv.style.display == "none" && menuChatDiv.style.display == "none" && configs6.HatsMenu) {
                    $(".augh").css({
                        "display": "inline-block"
                    });
                    $(".augh1").css({
                        "display": "inline-block"
                    });
                    $(".augh2").css({
                        "display": "inline-block"
                    });
                    $(".augh3").css({
                        "display": "inline-block"
                    });
                    $(".augh4").css({
                        "display": "inline-block"
                    });
                    $(".augh5").css({
                        "display": "inline-block"
                    });
                    $(".augh6").css({
                        "display": "inline-block"
                    });
                    $(".augh7").css({
                        "display": "inline-block"
                    });
                    $(".augh8").css({
                        "display": "inline-block"
                    });
                    $(".augh9").css({
                        "display": "inline-block"
                    });
                } else {
                    $(".augh").css({
                        "display": "none"
                    });
                    $(".augh1").css({
                        "display": "none"
                    });
                    $(".augh2").css({
                        "display": "none"
                    });
                    $(".augh3").css({
                        "display": "none"
                    });
                    $(".augh4").css({
                        "display": "none"
                    });
                    $(".augh5").css({
                        "display": "none"
                    });
                    $(".augh6").css({
                        "display": "none"
                    });
                    $(".augh7").css({
                        "display": "none"
                    });
                    $(".augh8").css({
                        "display": "none"
                    });
                    $(".augh9").css({
                        "display": "none"
                    });
                }
                if(menuDiv.style.display != "none") {
                    $(".menuClass").css({
                        'opacity': '1',
                    });
                    $(".menuClass2").css({
                        'opacity': '1',
                    });
                    $(".menuClass3").css({
                        'opacity': '1',
                    });
                    $(".menuClass4").css({
                        'opacity': '1',
                    });
                } else {
                    $(".menuClass").css({
                        'opacity': '0',
                    });
                    $(".menuClass2").css({
                        'opacity': '0',
                    });
                    $(".menuClass3").css({
                        'opacity': '0',
                    });
                    $(".menuClass4").css({
                        'opacity': '0',
                    });
                }
            }, 1);
            setInterval(() => {
                if(inGame) {
                    PrePlaceCount = 0 || -1;
                    if(configs6.AutoClear) {
                        console.clear();
                    }
                    Soldier = 6;
                }
            }, 20000);
            var songs;
            var converToJSDelay = (time) => {
                let newTime = time.split(":").reverse();
                time = 0;
                let convert = [6e4 * 60, 6e4, 1000, 1].reverse();
                newTime.forEach((b, c) => {
                    time += b * convert[c];
                });
                return time;
            };
            let chatting = false;
            document.addEventListener("keypress", function(e) {
                if (e.key == "Enter") {
                    chatting = !chatting
                }
            });
            function createPath() {
                grid = [];
                checkObject();
            }
            function autobot() {
                const trap1 = gameObjects
                .filter((e) => e.trap && e.active)
                .sort((a, b) => UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2))
                .find((trap) => {
                    const trapDist = Math.hypot(trap.y - near.y2, trap.x - near.x2);
                    return (
                        trap !== player &&
                        (player.sid === trap.owner.sid || findAllianceBySid(trap.owner.sid)) &&
                        trapDist <= 50
                    );
                });
                if(!my.autoPush) {
                    pathFind.scale = (config.maxScreenWidth / 2) * 1.3;
                    if (!traps.inTrap && (pathFind.chaseNear ? enemy.length : true)) {
                        let spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player)).sort(function(a, b) {
                            return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                        })[0];
                        if (near.dist2 <= 80 && trap1) {
                            packet("a", undefined, 1);
                        } else if(!trap1 && near.dist2 < (items.weapons[player.weaponIndex].range + near.scale * 1.8)){
                            packet("a", near.aim2 + Math.PI, 1);
                        } else if(near.dist2 >= (items.weapons[player.weaponIndex].range + near.scale * 1.8)){
                            packet("a", near.aim2, 1);
                        }
                    }
                }
            }
            let isItemSetted = [];
            function updateItemCountDisplay(index = undefined) {
                for (let i = 3; i < items.list.length; ++i) {
                    let id = items.list[i].group.id;
                    let tmpI = items.weapons.length + i;
                    if (!isItemSetted[tmpI]) {
                        isItemSetted[tmpI] = document.createElement("div");
                        isItemSetted[tmpI].id = "itemCount" + tmpI;
                        getEl("actionBarItem" + tmpI).appendChild(isItemSetted[tmpI]);
                        isItemSetted[tmpI].style = `
                        display: block;
                        position: absolute;
                        padding-left: 5px;
                        font-size: 2em;
                        color: #fff;
                        `;
                        isItemSetted[tmpI].innerHTML = player.itemCounts[id] || 0;
                    } else {
                        if (index == id) isItemSetted[tmpI].innerHTML = player.itemCounts[index] || 0;
                    }
                }
            }
            // AutoPush
            function autoPush() {
                let nearTrap = gameObjects.filter(tmp => tmp.trap && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 2) <= (near.scale + tmp.getScale() + 5)).sort(function (a, b) {
                    return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                })[0];
                if (nearTrap) {
                    let spike = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, nearTrap, 0, 0) <= (near.scale + nearTrap.scale + tmp.scale)).sort(function (a, b) {
                        return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                    })[0];
                    if (spike) {
                        let pos = {
                            x: spike.x + (250 * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
                            y: spike.y + (250 * Math.sin(UTILS.getDirect(near, spike, 2, 0))),
                            x2: spike.x + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.cos(UTILS.getDirect(near, spike, 2, 0))),
                            y2: spike.y + ((UTILS.getDist(near, spike, 2, 0) + player.scale) * Math.sin(UTILS.getDirect(near, spike, 2, 0)))
                        };
                        let finds = gameObjects.filter(tmp => tmp.active).find((tmp) => {
                            let tmpScale = tmp.getScale();
                            if (!tmp.ignoreCollision && UTILS.lineInRect(tmp.x - tmpScale, tmp.y - tmpScale, tmp.x + tmpScale, tmp.y + tmpScale, player.x2, player.y2, pos.x2, pos.y2)) {
                                return true;
                            }
                        });
                        if (finds) {
                            if (my.autoPush) {
                                my.autoPush = false;
                                packet("a", lastMoveDir||undefined, 1);
                            }
                        } else {
                            my.autoPush = true;
                            my.pushData = {
                                x: spike.x,
                                y: spike.y,
                                x2: pos.x2,
                                y2: pos.y2
                            };
                            let scale = (player.scale / 10);
                            if (UTILS.lineInRect(player.x2 - scale, player.y2 - scale, player.x2 + scale, player.y2 + scale, near.x2, near.y2, pos.x, pos.y)) {
                                packet("a", near.aim2, 1);
                            } else {
                                packet("a", UTILS.getDirect(pos, player, 2, 2), 1);
                            }
                        }
                    } else {
                        if (my.autoPush) {
                            my.autoPush = false;
                            packet("a", lastMoveDir||undefined, 1);
                        }
                    }
                } else {
                    if (my.autoPush) {
                        my.autoPush = false;
                        packet("a", lastMoveDir||undefined, 1);
                    }
                }
            }

            function Pathfinder() {
                pathFind.scale = (config.maxScreenWidth / 2) * 1.3;
                if (!traps.inTrap && (pathFind.chaseNear ? enemy.length : true)) {
                    if (near.dist2 <= items.weapons[player.weapons[0]].range) {
                        packet("a", undefined, 1);
                    } else {
                        createPath();
                        easystar.setGrid(grid);
                        easystar.setAcceptableTiles([0]);
                        easystar.enableDiagonals();
                        easystar.findPath((grid[0].length / 2), (grid.length / 2), pathFind.lastX, pathFind.lastY, function (path) {
                            if (path === null) {
                                pathFind.array = [];
                                if (near.dist2 <= items.weapons[player.weapons[0]].range) {
                                    packet("a", undefined, 1);
                                } else {
                                    packet("a", near.aim2, 1);
                                }
                            } else {
                                pathFind.array = path;
                                if (pathFind.array.length > 1) {
                                    let tmpXY = {
                                        x: (player.x2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * path[1].x),
                                        y: (player.y2 - (pathFind.scale / 2)) + ((pathFind.scale / pathFind.grid) * path[1].y)
                                    }
                                    packet("a", UTILS.getDirect(tmpXY, player, 0, 2), 1);
                                }
                            }
                        });
                        easystar.calculate();
                    }
                }
            }

            class AutoPush {
                socket = null;

                findIntersect(vec, vec1, vec2) {
                    // Find point of vec1 and vec2 intersection
                    const delta = Math.hypot(vec1.x - vec2.x, vec1.y - vec2.y) / 2;
                    const tang = Math.tan((vec1.y - vec2.y) / (vec1.x - vec2.x));
                    const vec3x = Math.cos(tang) * delta;
                    const vec3y = Math.sin(tang) * delta;
                    // Find angle from vec to vec3
                    const theta = Math.tan((vec.y - vec3y) / (vec.x - vec3x));

                    return theta;
                };

                pushEnemy(player, enemy, spike) {
                    const angle = this.findIntersect(enemy, spike, player);
                    const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

                    if (dist > 180) return;

                    this.socket.send("33", angle);
                };

                constructor(socket) {
                    this.socket = socket;
                }
            }

            function addDeadPlayer(tmpObj) {
                deadPlayers.push(new DeadPlayer(tmpObj.x, tmpObj.y, tmpObj.dir, tmpObj.buildIndex, tmpObj.weaponIndex, tmpObj.weaponVariant, tmpObj.skinColor, tmpObj.scale, tmpObj.name));
            }
            function setInitData(data) {
                alliances = data.teams;
            }

            function secondSocket() {
                let time = Date.now();
                const e = time - second;
                window.pingTime = e;
            }
            const Qt = document.getElementById("pingDisplay")
            var lastPing = -1;
            var maxPing = NaN;
            var minPing = NaN;
            var pingCount = 0;
            var doAutoQ = false;

            function pingSocketResponse() {
                let pingTime = window.pingTime;
                pingCount++;
                if (pingTime > ms.max || isNaN(ms.max)) {
                    ms.max = pingTime;
                }
                if (pingTime < ms.min || isNaN(ms.min)) {
                    ms.min = pingTime;
                }
                if (pingTime >= 140) {
                    doAutoQ = true;
                } else {
                    doAutoQ = false;
                }
            }

            function pingSocket() {
                lastPing = Date.now();
                io.send('0');
            }
            var fisrtloadez = false;
            function setupGame(yourSID) {
                keys = {};
                macro = {};
                playerSID = yourSID;
                attackState = 0;
                inGame = true;
                fisrtloadez = true;
                packet("d", 0, getAttackDir(), 1);
                my.ageInsta = true;
                if (firstSetup) {
                    firstSetup = false;
                    gameObjects.length = 0;
                }
            }
            function addPlayer(data, isYou) {
                let tmpPlayer = findPlayerByID(data[0]);
                if (!tmpPlayer) {
                    tmpPlayer = new Player(data[0], data[1], config, UTILS, projectileManager,
                                           objectManager, players, ais, items, hats, accessories);
                    players.push(tmpPlayer);
                    if (data[1] != playerSID) {
                        addChatLog("Encountered " + data[2], "#23BD86", "", "#23BD86");
                    }
                } else {
                    if (data[1] != playerSID) {
                        addChatLog("Encountered " + data[2], "#23BD86", "", "#23BD86");
                    }
                }
                tmpPlayer.spawn(isYou ? true : null);
                tmpPlayer.visible = false;
                tmpPlayer.oldPos = {
                    x2: undefined,
                    y2: undefined
                };
                tmpPlayer.x2 = undefined;
                tmpPlayer.y2 = undefined;
                tmpPlayer.x3 = undefined;
                tmpPlayer.y3 = undefined;
                tmpPlayer.setData(data);
                if (isYou) {
                    if (!player) {
                        window.prepareUI(tmpPlayer);
                    }
                    player = tmpPlayer;
                    camX = player.x;
                    camY = player.y;
                    my.lastDir = 0;
                    updateItems();
                    updateAge();
                    updateItemCountDisplay();
                    if (player.skins[7]) {
                        my.reSync = true;
                    }
                }
            }
            function removePlayer(id) {
                for (let i = 0; i < players.length; i++) {
                    if (players[i].id == id) {
                        let tmpPlayer = players[i];
                        addChatLog(tmpPlayer.name + " has left", "red", "", "red");
                        players.splice(i, 1);
                        break;
                    }
                }
            }

            var newHatImgs = {
                7: "https://i.imgur.com/vAOzlyY.png",
                15: "https://i.imgur.com/YRQ8Ybq.png",
                //11: "https://i.imgur.com/yfqME8H.png",
                //12: "https://i.imgur.com/VSUId2s.png",
                40: "https://i.imgur.com/Xzmg27N.png",
                //26: "https://i.imgur.com/I0xGtyZ.png",
                //6: "https://i.imgur.com/vM9Ri8g.png",
            };
            var newAccImgs = {
                //18: "https://i.imgur.com/0rmN7L9.png",
                21: "https://i.imgur.com/4ddZert.png",
            };
            var newWeaponImgs = {
                "great_hammer_1": "https://cdn.discordapp.com/attachments/952594150879006841/1077259072413368330/76_20230220114828.png",
                "great_hammer_1_g": "https://cdn.discordapp.com/attachments/952594150879006841/1077259072790863892/76_20230220114742.png",
                "great_hammer_1_d": "https://cdn.discordapp.com/attachments/952594150879006841/1077259073147392171/Fg93gj3.png",
                "great_hammer_1_r": "https://cdn.discordapp.com/attachments/952594150879006841/1077259073835237466/76_20230220114918.png",
                //"samurai_1": "https://i.imgur.com/mbDE77n.png",
                // "samurai_1_g": "https://cdn.discordapp.com/attachments/967213871267971072/1030852038948552724/image.png",
            };

            function getTexturePackImg(index, type) {
                if(newHatImgs[index] && type == "hat") {
                    return newHatImgs[index];
                }else if(newAccImgs[index] && type == "acc") {
                    return newAccImgs[index];
                }else if(newWeaponImgs[index] && type == "weapons") {
                    return newWeaponImgs[index];
                }else {
                    if(type == "acc") {
                        return ".././img/accessories/access_" + index + ".png";
                    }else if(type == "hat") {
                        return ".././img/hats/hat_" + index + ".png";
                    }else {
                        return ".././img/weapons/" + index + ".png";
                    }
                }
            }
            function updateHealth(sid, value) {
                tmpObj = findPlayerBySID(sid);
                if (tmpObj) {
                    tmpObj.oldHealth = tmpObj.health;
                    tmpObj.health = value;
                    tmpObj.judgeShame();
                    if (tmpObj.oldHealth > tmpObj.health) {
                        if (tmpObj == near) {
                            let damage = tmpObj.oldHealth - tmpObj.health;
                            if (tmpObj.skinIndex == 7 && (damage == 5 || (tmpObj.latestTail == 0 && damage == 2))) {
                                tmpObj.bullTick = game.tick;
                            }
                        }
                        tmpObj.damaged = tmpObj.oldHealth - tmpObj.health;
                        let damaged = tmpObj.damaged;
                        tmpObj = findPlayerBySID(sid);
                        let bullTicked = false;
                        if (tmpObj && tmpObj.health <= 0) {
                            if (!tmpObj.death) {
                                tmpObj.death = true;
                                if (tmpObj != player) {
                                    //console.warn(getAttacker(damaged));
                                    addChatLog(tmpObj.name + " has died", "#db2727", "", "#db2727");
                                }
                                addDeadPlayer(tmpObj);
                            }
                        }
                        if (tmpObj == player) {
                            if (tmpObj.skinIndex == 7 && (damaged == 5 || (tmpObj.latestTail == 0 && damaged == 2))) {
                                if (my.reSync) {
                                    my.reSync = false;
                                    tmpObj.setBullTick = true;
                                }
                                bullTicked = true;
                            }
                            if (inGame) {
                                let attackers = getAttacker(damaged);
                                let gearDmgs = [0.25, 0.45].map((val) => val * items.weapons[player.weapons[0]].dmg * soldierMult());
                                let includeSpikeDmgs = !bullTicked && gearDmgs.includes(damaged);
                                //let healTimeout = (1000/9);
                                let healTimeout = 140 - window.ping;
                                let slowHeal = function(timer) {
                                    setTimeout(() => {
                                        healer();
                                    }, timer);
                                }
                                if(antiSync) {
                                    healer();
                                    player.canEmpAnti = false;
                                }
                                let total = 0;
                                let MuandTu = [37, 38, 19, 25, 50, 75, 56, 57];
                                let damages = [35, 39, 41, 45, 37, 38, 50, 30];
                                if (damaged >= (includeSpikeDmgs ? 8 : 20) && tmpObj.damageThreat >= 25 && (game.tick - tmpObj.antiTimer) > 1) {
                                    player.canEmpAnti = true;
                                    player.antiTimer = game.tick;
                                    let shame = Math.floor(Math.random() * (6 - 4) + 3);
                                    if(player.health < 22 && player.shameCount < 6) {
                                        healer();
                                    } else if(damaged > 10 && configs2.StrongHeal && player.shameCount < 6) {
                                        healer();
                                    } else if(player.health < 50 && damaged !== MuandTu.length && player.shameCount > 2 && player.shameCount < 6) {
                                        healer();
                                    } else if((damaged == damages.length || (damaged > 10 && damaged < 25)) && player.shameCount <= 5) {
                                        healer();
                                    } else if (tmpObj.shameCount < shame) {
                                        healer();
                                    } else {
                                        slowHeal(healTimeout);
                                    }
                                } else {
                                    if(player.health < 22 && player.shameCount < 6) {
                                        healer();
                                    } else {
                                        slowHeal(healTimeout);
                                    }
                                }
                                if (damaged >= 30 && player.skinIndex == 11 && damaged !== MuandTu.length) instaC.canCounter = true;
                            }
                        } else {
                            if (!tmpObj.setPoisonTick && (tmpObj.damaged == 5 || (tmpObj.latestTail == 0 && tmpObj.damaged == 2))) {
                                tmpObj.setPoisonTick = true;
                            }
                        }
                    } else {
                        if(tmpObj != player) {
                            if(tmpObj.maxShameCount < tmpObj.shameCount) {
                                tmpObj.maxShameCount = tmpObj.shameCount;
                            }
                        }
                    }
                }
            }
            function killPlayer() {
                inGame = false;
                lastDeath = {
                    x: player.x,
                    y: player.y,
                };
            }
            function isElementVisible(e) {
                return (e.offsetParent !== null);
            }
            let Le = document.getElementById("nameInput");
            setInterval(() => {
                if (player && player.alive) {
                    document.getElementById("mainMenu").style.backgroundImage = "url()";
                }
                if(isElementVisible(document.getElementById("enterGame"))) {
                    document.getElementById('promoImgHolder').innerHTML =
                        `
  <style>
  #linksContainer2 { background: #ccc; border-top: 5px solid; border-image: linear-gradient(to right,#333,#333) 1 1 0 0; height: 18px; top: 0%; color: #333; transition: 0.3s;
  } #linksContainer2:hover { background: #ccc; box-shadow: 0 0 20px #333;
  } #top-wrap-right { color: #333;
  } .check-box {transform: scale(1.1);
  } .inParty {display: none;
  } input[type="checkbox"] { background: rgba(200, 200, 200, 0.1); position: relative; appearance: none; width: 33px; height: 15.5px; border-radius: 50px; box-shadow: inset 0 0 5px rgba(41, 41, 41, 0.8); cursor: pointer; top: 7.5px; transition: 0.7s;
  } input:checked[type="checkbox"] { background: rgba(200, 200, 200, 0.5);
  } input[type="checkbox"]::after { position: absolute; content: ""; width: 15.5px; height: 15.5px; top: 0; left: 0; background: #fff; border-radius: 50%; box-shadow: 0 0 5px rgba(0, 0, 0, 0.9); transform: scale(1.1); transition: 0.7s;
  } input:checked[type="checkbox"]::after { left: 50%;
  } .menuCard { background-color: #181818; border-top: 5px solid; border-image: linear-gradient(to right,#333,#303030) 1 0 0 0; color: #333; margin-top:0px; border-radius: 0px; border-bottom: 0px solid red; transition: all 1s; transform: scale(1); box-shadow: 0px 0px #333; transform: translateX(0px);
  } .menuCard.active { transform: translateX(0px);
  } #adCard { display: none;
  } #adCard { display: none;
  } #promoImgHolder { overflow-y: scroll; -ms-overflow-style: none; scrollbar-width: none; height: 90px; max-height: 90px; color: #333; }
  </style>
      </head>
      <div>
  <i class="fa-solid fa-rectangle-list"style="font-size: 25px"></i><p></p> <div style="font-size: 18px">
  Frames: ${UTILS.round(fpsTimer.ltime, 10)}<br>
  Packet: ${secPacket}<br>


  </div><div style="font-size: 15px">
  </div><br>
  `
                    $("#menuDiv").hide();
                } else {
                    document.getElementById('promoImgHolder').innerHTML =
                        `
  <style>
  #linksContainer2 { background: #ccc; border-top: 5px solid; border-image: linear-gradient(to right,#333,#333) 1 1 0 0; height: 18px; top: 0%; color: #333; transition: 0.3s;
  } #linksContainer2:hover { background: #ccc; box-shadow: 0 0 20px #333;
  } #top-wrap-right { color: #333;
  } .check-box {transform: scale(1.1);
  } .inParty {display: none;
  } input[type="checkbox"] { position: relative; appearance: none; width: 33px; height: 15.5px; border-radius: 50px; box-shadow: inset 0 0 5px rgba(41, 41, 41, 0.8); cursor: pointer; top: 7.5px; transition: 0.7s;
  } input:checked[type="checkbox"] { background: rgba(51, 51, 51);
  } input[type="checkbox"]::after { position: absolute; content: ""; width: 15.5px; height: 15.5px; top: 0; left: 0; background: #fff; border-radius: 50%; box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); transform: scale(1.1); transition: 0.7s;
  } input:checked[type="checkbox"]::after { left: 50%;
  } .menuCard { background-color: #181818; border-top: 5px solid; border-image: linear-gradient(to right,#333,#303030) 1 0 0 0; color: #333; margin-top:0px; border-radius: 0px; border-bottom: 0px solid red; transition: all 1s; transform: scale(1); box-shadow: 0px 0px #333; transform: translateX(0px);
  } .menuCard.active { transform: translateX(0px);
  } #adCard { display: none;
  } #adCard { display: none;
  } #promoImgHolder { overflow-y: scroll; -ms-overflow-style: none; scrollbar-width: none; height: 90px; max-height: 90px; }
  </div><br>
  `
                }
            }, 300);
            function updateItemCounts(index, value) {
                if (player) {
                    player.itemCounts[index] = value;
                    updateItemCountDisplay(index);
                }
            }
            var ageText = getEl("ageText");
            var ageBarBody = getEl("ageBarBody");
            function updateAge(xp, mxp, age) {
                if (xp != undefined)
                    player.XP = xp;
                if (mxp != undefined)
                    player.maxXP = mxp;
                if (age != undefined)
                    player.age = age;
                if (age == config.maxAge) {
                    ageText.innerHTML = "MAX AGE";
                } else {
                    ageText.innerHTML = "AGE " + player.age;
                    ageBarBody.style.transition = "2s";
                }
            }
            function updateUpgrades(points, age) {
                player.upgradePoints = points;
                player.upgrAge = age;
                if (points > 0) {
                    tmpList.length = 0;
                    UTILS.removeAllChildren(upgradeHolder);
                    for (let i = 0; i < items.weapons.length; ++i) {
                        if (items.weapons[i].age == age && (testMode || items.weapons[i].pre == undefined || player.weapons.indexOf(items.weapons[i].pre) >= 0)) {
                            let e = UTILS.generateElement({
                                id: "upgradeItem" + i,
                                class: "actionBarItem",
                                onmouseout: function() {
                                    showItemInfo();
                                },
                                parent: upgradeHolder
                            });
                            e.style.backgroundImage = getEl("actionBarItem" + i).style.backgroundImage;
                            tmpList.push(i);
                        }
                    }
                    for (let i = 0; i < items.list.length; ++i) {
                        if (items.list[i].age == age && (testMode || items.list[i].pre == undefined || player.items.indexOf(items.list[i].pre) >= 0)) {
                            let tmpI = (items.weapons.length + i);
                            let e = UTILS.generateElement({
                                id: "upgradeItem" + tmpI,
                                class: "actionBarItem",
                                onmouseout: function() {
                                    showItemInfo();
                                },
                                parent: upgradeHolder
                            });
                            e.style.backgroundImage = getEl("actionBarItem" + tmpI).style.backgroundImage;
                            tmpList.push(tmpI);
                        }
                    }
                    for (let i = 0; i < tmpList.length; i++) {
                        (function(i) {
                            let tmpItem = getEl('upgradeItem' + i);
                            tmpItem.onmouseover = function() {
                                if (items.weapons[i]) {
                                    showItemInfo(items.weapons[i], true);
                                } else {
                                    showItemInfo(items.list[i - items.weapons.length]);
                                }
                            };
                            tmpItem.onclick = UTILS.checkTrusted(function() {
                                packet("H", i);
                            });
                            UTILS.hookTouchEvents(tmpItem);
                        })(tmpList[i]);
                    }
                    if (tmpList.length) {
                        upgradeHolder.style.display = "block";
                        upgradeCounter.style.display = "block";
                        upgradeCounter.style.borderRadius = "4px";
                        upgradeCounter.innerHTML = "Select Items"; //"SELECT ITEMS (" + points + ")";
                    } else {
                        upgradeHolder.style.display = "none";
                        upgradeCounter.style.display = "none";
                        showItemInfo();
                    }
                } else {
                    upgradeHolder.style.display = "none";
                    upgradeCounter.style.display = "none";
                    showItemInfo();
                }
                if(!my.autoAim && !instaC.isTrue) {
                    if (configs.AutoUpgrade && getEl("autoupDate").value == "basic") {
                        if(age == 3) {
                            sendUpgrade(17)
                        } else if (age == 4) {
                            sendUpgrade(31)
                        } else if (age == 5) {
                            sendUpgrade(23)
                        } else if (age == 8) {
                            if(player.secondaryIndex == 9) {
                                sendUpgrade(12)
                            } else if(player.primaryIndex == 3) {
                                sendUpgrade(4)
                            } else {
                                sendUpgrade(28)
                            }
                        } else if (age == 9) {
                            if(player.secondaryIndex == 12) {
                                sendUpgrade(15)
                            } else {
                                sendUpgrade(25)
                            }
                        }
                    } else if(getEl("autoupDate").value == "smup") {
                        if(age == 2) {
                            sendUpgrade(3);
                        } else if(age == 3) {
                            sendUpgrade(17)
                        } else if (age == 4) {
                            sendUpgrade(31)
                        } else if (age == 5) {
                            sendUpgrade(23)
                        } else if (age == 6) {
                            sendUpgrade(9);
                        } else if(age == 7) {
                            sendUpgrade(38);
                        } else if (age == 8) {
                            if(player.secondaryIndex == 9) {
                                sendUpgrade(12)
                            } else if(player.primaryIndex == 3) {
                                sendUpgrade(4)
                            } else {
                                sendUpgrade(28)
                            }
                        } else if (age == 9) {
                            if(player.secondaryIndex == 12) {
                                sendUpgrade(15)
                            } else {
                                sendUpgrade(25)
                            }
                        }
                    } else if(getEl("autoupDate").value == "khup") {
                        if(age == 2) {
                            sendUpgrade(3);
                        } else if(age == 3) {
                            sendUpgrade(17)
                        } else if (age == 4) {
                            sendUpgrade(31)
                        } else if (age == 5) {
                            sendUpgrade(23)
                        } else if (age == 6) {
                            sendUpgrade(10)
                        } else if(age == 7) {
                            sendUpgrade(38);
                        } else if (age == 8) {
                            if(player.secondaryIndex == 9) {
                                sendUpgrade(12)
                            } else if(player.primaryIndex == 3) {
                                sendUpgrade(4)
                            } else {
                                sendUpgrade(28)
                            }
                        } else if (age == 9) {
                            if(player.secondaryIndex == 12) {
                                sendUpgrade(15)
                            } else {
                                sendUpgrade(25)
                            }
                        }
                    }
                }
            }
            function cdf(e, t) {
                try {
                    return Math.hypot((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return Infinity;
                }
            }
            function caf(e, t) {
                try {
                    return Math.atan2((t.y2 || t.y) - (e.y2 || e.y), (t.x2 || t.x) - (e.x2 || e.x));
                } catch (e) {
                    return 0;
                }
            }
            function numArr(e = 0, t = 1, act, n = 1) {
                let arr = [];
                for (let i = e; i < t; i += n) {
                    arr.push(i);
                    typeof act == "function" && act(i);
                }
                return arr;
            }
            function toR(e) {
                var n = (e * Math.PI / 180) % (2 * Math.PI);
                return n > Math.PI ? Math.PI - n : n
            }
            function toD(e) {
                var n = (e / Math.PI * 360) % 360;
                return n >= 360 ? n - 360 : n;
            }

            /* function killObject(sid) {
                let findObj = findObjectBySid(sid);
                objectManager.disableBySid(sid);
                let n = findObj;
                if (n && cdf(player, n) < 200) {
                    if (nears.length) {
                        let enemy = near;
                        let A = player;
                        let dist = cdf(A, enemy);
                        let dir = caf(A, enemy);
                        let dir2 = caf(player, dir + toR(180));//this dir can works to laggy players
                        let ignore = [0, 0];
                        let place = function(t, f) {
                            checkPlace(t, f);
                        }
                        if (dist < 500) {
                            for(let i = 0; i != 2; i++) {
                                if (dist < 200) {
                                    for(let i = 0; i < Math.PI; i += toR(items.list[A.items[2]].scale)) {
                                        let placed;
                                        if (ignore[0]) {
                                            placed = false;
                                            ignore[0]--;
                                        } else {
                                            place(2, (dir || dir2) + i) && (toD(i) < items.list[A.items[2]].scale && (ignore[1] = Math.ceil(items.list[A.items[2]].scale / toD(Math.PI / 12))), placed = true);
                                        }
                                        placed && (ignore[0] = Math.ceil(items.list[A.items[2]].scale / toD(Math.PI / 12)));
                                        if (!placed || UTILS.getAngleDist(dir + i, dir - i) > toR(items.list[A.items[2]].scale)) {
                                            if (ignore[1]) {
                                                ignore[1]--;
                                            } else {
                                                place(2, dir - i) && (ignore[1] = Math.ceil(items.list[A.items[2]].scale / toD(Math.PI / 12)))
                                            }
                                        }
                                    }
                                    place(4, toR(toD(dir) - 180));
                                } else {
                                    let ignore = 0;
                                    if (ignore) {
                                        ignore--;
                                    } else {
                                        for(let i = 0; i < Math.PI/2; i += Math.PI / 3) {
                                            checkPlace(4, dir + i) && (ignore = Math.ceil(50 / Math.PI / 6));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }*/
            function killObject(sid) {
                let findObj = findObjectBySid(sid);
                objectManager.disableBySid(sid);
                if (player) {
                    for (let i = 0; i < breakObjects.length; i++) {
                        if (breakObjects[i].sid == sid) {
                            breakObjects.splice(i, 1);
                            break;
                        }
                    }
                    if (!player.canSee(findObj)) {
                        breakTrackers.push({x: findObj.x, y: findObj.y});
                    }
                    if (breakTrackers.length > 8) {
                        breakTrackers.shift();
                    }
                    traps.replacer(findObj);
                }
            }
            function killObjects(sid) {
                if (player) objectManager.removeAllItems(sid);
            }
            function fgdo(a, b) {
                return Math.sqrt(Math.pow((b.y - a.y), 2) + Math.pow((b.x - a.x), 2));
            }

            let ticks = {
                tick: 0,
                delay: 0,
                time: [],
                manage: [],
            };
            function setTickout(doo, timeout) {
                if (!ticks.manage[ticks.tick + timeout]) {
                    ticks.manage[ticks.tick + timeout] = [doo];
                } else {
                    ticks.manage[ticks.tick + timeout].push(doo);
                }
            }
            function doNextTick(doo) {
                waitTicks.push(doo);
            }
            let waitTicks = [];
            let nEy;
            let placeableSpikes = [];
            let placeableTraps = [];
            let placeableSpikesPREDICTS = [];
            let autos = {
                insta: {
                    todo: false,
                    wait: false,
                    count: 4,
                    shame: 5
                },
                bull: false,
                antibull: 0,
                reloaded: false,
                stopspin: true
            }
            let autoQ = false;
            function updatePlayers(data) {
                game.tick++;
                enemy = [];
                nears = [];
                near = [];
                game.tickSpeed = performance.now() - game.lastTick;
                game.lastTick = performance.now();
                ticks.tick++;
                ticks.time.push(Date.now() - ticks.delay <= 50 || Date.now() - ticks.delay >= 175 ? "lag" : 1);
                if (ticks.tick % 10 === 0) {
                    ticks.time = [];
                    antiSync = false;
                }
                if (ticks.tick % 300 === 0) {
                    ms.max = window.pingTime;
                    ms.min = window.pingTime;
                    players.forEach((tmp) => {
                        tmp.maxShameCount = 0;
                    })
                }
                ticks.delay = Date.now();
                players.forEach((tmp) => {
                    tmp.forcePos = !tmp.visible;
                    tmp.visible = false;
                });
                for (let i = 0; i < data.length;) {
                    tmpObj = findPlayerBySID(data[i]);
                    if (tmpObj) {
                        tmpObj.t1 = (tmpObj.t2 === undefined) ? game.lastTick : tmpObj.t2;
                        tmpObj.t2 = game.lastTick;
                        tmpObj.oldPos.x2 = tmpObj.x2;
                        tmpObj.oldPos.y2 = tmpObj.y2;
                        tmpObj.x1 = tmpObj.x;
                        tmpObj.y1 = tmpObj.y;
                        tmpObj.x2 = data[i + 1];
                        tmpObj.y2 = data[i + 2];
                        tmpObj.x3 = tmpObj.x2 + (tmpObj.x2 - tmpObj.oldPos.x2);
                        tmpObj.y3 = tmpObj.y2 + (tmpObj.y2 - tmpObj.oldPos.y2);
                        tmpObj.d1 = (tmpObj.d2 === undefined) ? data[i + 3] : tmpObj.d2;
                        tmpObj.d2 = data[i + 3];
                        tmpObj.dt = 0;
                        tmpObj.buildIndex = data[i + 4];
                        tmpObj.weaponIndex = data[i + 5];
                        tmpObj.weaponVariant = data[i + 6];
                        tmpObj.team = data[i + 7];
                        tmpObj.isLeader = data[i + 8];
                        tmpObj.oldSkinIndex = tmpObj.skinIndex;
                        tmpObj.oldTailIndex = tmpObj.tailIndex;
                        tmpObj.skinIndex = data[i + 9];
                        tmpObj.tailIndex = data[i + 10];
                        tmpObj.iconIndex = data[i + 11];
                        tmpObj.zIndex = data[i + 12];
                        tmpObj.visible = true;
                        tmpObj.update(game.tickSpeed);
                        tmpObj.dist2 = UTILS.getDist(tmpObj, player, 2, 2);
                        tmpObj.aim2 = UTILS.getDirect(tmpObj, player, 2, 2);
                        tmpObj.dist3 = UTILS.getDist(tmpObj, player, 3, 3);
                        tmpObj.aim3 = UTILS.getDirect(tmpObj, player, 3, 3);
                        tmpObj.damageThreat = 0;
                        if (tmpObj.skinIndex == 45 && tmpObj.shameTimer <= 0) {
                            tmpObj.addShameTimer();
                        }
                        if (tmpObj.oldSkinIndex == 45 && tmpObj.skinIndex != 45) {
                            tmpObj.shameTimer = 0;
                            if (tmpObj == player) {
                                healer();
                            }
                        }

                        if ((window.pingTime > 90 || ms.avg > 90)) {
                            if (player.shameCount < 4 && near.dist2 <= 300 && near.reloads[near.primaryIndex] <= config.tickRate * (window.pingTime >= 200 ? 2 : 1)) {
                                autoQ = true;
                                place(0, getAttackDir());
                            } else {
                                if (autoQ) {
                                    place(0, getAttackDir());
                                }
                                autoQ = false;
                            }
                        }

                        nEy = tmpObj;
                        if (tmpObj == player) {
                            if (gameObjects.length) {
                                gameObjects.forEach((tmp) => {
                                    tmp.onNear = false;
                                    if (tmp.active) {
                                        if (!tmp.onNear && UTILS.getDist(tmp, tmpObj, 0, 2) <= tmp.scale + items.weapons[tmpObj.weapons[0]].range) {
                                            tmp.onNear = true;
                                        }
                                        if (tmp.isItem && tmp.owner) {
                                            if (!tmp.pps && tmpObj.sid == tmp.owner.sid && UTILS.getDist(tmp, tmpObj, 0, 2) > (parseInt(700) || 0) && !tmp.breakObj && ![13, 14, 20].includes(tmp.id)) {
                                                tmp.breakObj = true;
                                                breakObjects.push({
                                                    x: tmp.x,
                                                    y: tmp.y,
                                                    sid: tmp.sid
                                                });
                                            }
                                        }
                                    }
                                });
                                let nearTrap = gameObjects.filter(e => e.trap && e.active && UTILS.getDist(e, tmpObj, 0, 2) <= (tmpObj.scale + e.getScale() + 5) && !e.isTeamObject(tmpObj)).sort(function(a, b) {
                                    return UTILS.getDist(a, tmpObj, 0, 2) - UTILS.getDist(b, tmpObj, 0, 2);
                                })[0];
                                if (nearTrap && instaType) {
                                    traps.dist = UTILS.getDist(nearTrap, tmpObj, 0, 2);
                                    traps.aim = UTILS.getDirect(nearTrap, tmpObj, 0, 2);
                                    traps.inTrap = true;
                                    traps.info = nearTrap;
                                } else {
                                    traps.inTrap = false;
                                    traps.info = {};
                                }
                            } else {
                                traps.inTrap = false;
                            }
                        }
                        if (tmpObj.weaponIndex < 9) {
                            tmpObj.primaryIndex = tmpObj.weaponIndex;
                            tmpObj.primaryVariant = tmpObj.weaponVariant;
                        } else if (tmpObj.weaponIndex > 8) {
                            tmpObj.secondaryIndex = tmpObj.weaponIndex;
                            tmpObj.secondaryVariant = tmpObj.weaponVariant;
                        }
                    }
                    i += 13;
                }
                if (waitTicks.length) {
                    waitTicks.forEach((ajaj) => {
                        ajaj();
                    }
                                     );
                    waitTicks = [];
                }
                if (runAtNextTick.length) {
                    runAtNextTick.forEach((tmp) => {
                        checkProjectileHolder(...tmp);
                    }
                                         );
                    runAtNextTick = [];
                }
                if (textManager.stack.length) {
                    let stacks = [];
                    let notstacks = [];
                    let num = 0;
                    let num2 = 0;
                    let pos = {
                        x: null,
                        y: null
                    };
                    let pos2 = {
                        x: null,
                        y: null
                    }
                    textManager.stack.forEach((text) => {
                        if (text.value >= 0) {
                            if (num == 0) pos = {
                                x: text.x,
                                y: text.y
                            };
                            num += Math.abs(text.value);
                        } else {
                            if (num2 == 0) pos2 = {
                                x: text.x,
                                y: text.y
                            };
                            num2 += Math.abs(text.value);
                        }
                    });
                    if (num2 > 0) {
                        textManager.showText(pos2.x, pos2.y, 50, 0.18, 500, num2, healTextColor);
                    }
                    if (num > 0) {
                        textManager.showText(pos.x, pos.y, 50, 0.18, 500, num, damageTextColor);
                    }
                    textManager.stack = [];
                }
                if (runAtNextTick.length) {
                    runAtNextTick.forEach((tmp) => {
                        checkProjectileHolder(...tmp);
                    });
                    runAtNextTick = [];
                }
                for (let i = 0; i < data.length;) {
                    tmpObj = findPlayerBySID(data[i]);
                    if (tmpObj) {
                        if (!tmpObj.isTeam(player)) {
                            enemy.push(tmpObj);
                            if (tmpObj.dist2 <= items.weapons[tmpObj.primaryIndex == undefined ? 5 : tmpObj.primaryIndex].range + (player.scale * 2)) {
                                nears.push(tmpObj);
                            }
                        }
                        tmpObj.manageReload();
                        if (tmpObj != player) {
                            tmpObj.addDamageThreat(player);
                        }
                    }
                    i += 13;
                }
                if (player && player.alive) {
                    if (enemy.length) {
                        if (player && player.alive){
                            placeableSpikes = getPlaceablePositions(player, items.list[player.items[2]]);
                            placeableTraps = player.items[4] == 15 ? getPlaceablePositions(player, items.list[player.items[4]]) : [];
                        }

                        near = enemy.sort(function(tmp1, tmp2) {
                            return tmp1.dist2 - tmp2.dist2;
                        })[0];
                    }
                    if (game.tickQueue[game.tick]) {
                        game.tickQueue[game.tick].forEach((action) => {
                            action();
                        });
                        game.tickQueue[game.tick] = null;
                    }
                    if (advHeal.length) {
                        advHeal.forEach((updHealth) => {

                        });
                        advHeal = [];
                    }
                    players.forEach((tmp) => {
                        if (!tmp.visible && player != tmp) {
                            tmp.reloads = {
                                0: 0,
                                1: 0,
                                2: 0,
                                3: 0,
                                4: 0,
                                5: 0,
                                6: 0,
                                7: 0,
                                8: 0,
                                9: 0,
                                10: 0,
                                11: 0,
                                12: 0,
                                13: 0,
                                14: 0,
                                15: 0,
                                53: 0,
                            };
                        }
                        if (tmp.setBullTick) {
                            tmp.bullTimer = 0;
                        }
                        if (tmp.setPoisonTick) {
                            tmp.poisonTimer = 0;
                        }
                        tmp.updateTimer();
                    });
                    if (inGame) {
                        if(player.empAnti) {
                            player.empAnti = false;
                        }
                        if (player.soldierAnti) {
                            player.soldierAnti = false;
                        }
                        if (enemy.length) {
                            if (player.canEmpAnti) {
                                player.canEmpAnti = false;
                                if (near.dist2 <= 300) {
                                    if (near.reloads[53] == 0 && !my.safePrimary(near) && !my.safeSecondary(near)) {
                                        player.empAnti = true;
                                        player.soldierAnti = false;
                                    } else {
                                        player.empAnti = false;
                                        player.soldierAnti = true;
                                    }
                                } else {
                                    player.empAnti = false;
                                    player.soldierAnti = true;
                                }
                            } else {
                                player.empAnti = false;
                                player.soldierAnti = true;
                            }
                            let prehit = gameObjects.filter(tmp => tmp.dmg && tmp.active && tmp.isTeamObject(player) && UTILS.getDist(tmp, near, 0, 3) <= (tmp.scale + near.scale)).sort(function(a, b) {
                                return UTILS.getDist(a, near, 0, 2) - UTILS.getDist(b, near, 0, 2);
                            })[0];
                            if (prehit) {
                                if (near.dist2 <= items.weapons[player.weapons[0]].range + player.scale * 1.8) {
                                    buyEquip(Wings, 1)
                                    instaC.canSpikeTick = true;
                                }
                            }
                            let antiSpikeTick = gameObjects.filter(tmp => tmp.dmg && tmp.active && !tmp.isTeamObject(player) && UTILS.getDist(tmp, player, 0, 3) < (tmp.scale + player.scale)).sort(function(a, b) {
                                return UTILS.getDist(a, player, 0, 2) - UTILS.getDist(b, player, 0, 2);
                            })[0];
                            if (antiSpikeTick && !traps.inTrap) {
                                if (near.dist2 <= items.weapons[5].range + near.scale * 1.8) {
                                    my.anti0Tick = 1;
                                    player.chat.count = 2000;
                                }
                            }
                        }
                        if((game.tick - near.bullTick) % 9 == 0 && near.skinIndex == 7) {
                            addChatLog("Bulltick detected: " + near.name + "[" + near.sid + "]", "#40E0D0", "", "#40E0D0");
                            bultect = true;
                            game.tickBase(() => {
                                bultect = false;
                            }, 1)
                        }
                        if ((near.skinIndex != 26 && near.skinIndex != 6 && (((near.shameCount > 2 && player.weapons[1] != 10) || (player.weapons[1] == 10 && (near.shameCount > 0)))) || (near.shameCount > 4 && player.weapons[1] != 10)) && (configs3.AutoInsta || config.autobot) && player.reloads[53] == 0 && (trueM ? true : ((player.checkCanInsta(true) >= 100 ? player.checkCanInsta(true) : player.checkCanInsta(false)) >= (player.weapons[1] == 10 ? 95 : 100))) && near.dist2 <= items.weapons[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]].range + near.scale * 1.8 && (instaC.wait || (trueM && Math.floor(Math.random() * 2) == 0) || bultect) && ((trueM && near.shameCount >= near.maxShameCount) || (trueM && true)) && !instaC.isTrue && !my.waitHit && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0 && instaC.perfCheck(player, near)) {
                            instaC.can = true;
                        } else if (instaType){
                            instaC.can = false;
                        }

                        macro.q && place(0, getAttackDir());
                        macro.f && place(4, getSafeDir());
                        macro.v && place(2, getSafeDir());
                        macro.b && place(1, getSafeDir());
                        macro.h && place(player.getItemType(22), getSafeDir());
                        macro.l && place(3, getSafeDir());
                        //New 3xPlace
                        if (game.tick % 3 == 0) {
                            if (mills.place && player.moveDir != undefined && !traps.inTrap && (near.dist2 > 150 || !enemy.length)) {
                                let plcAng = 1.25;
                                for (let i = -plcAng; i <= plcAng; i += plcAng) {
                                    checkPlace(3, UTILS.getDirect(player.oldPos, player, 2, 2) + i);
                                }
                            } else {
                                if (mills.placeSpawnPads && !traps.inTrap) {
                                    for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                                        checkPlace(
                                            player.getItemType(20),
                                            UTILS.getDirect(player.oldPos, player, 2, 2) + i
                                        );
                                    }
                                }
                            }
                        }
                        if (instaC.can) {
                            instaC.changeType((player.weapons[1] == 10 || configs3.RevInsta) ? "rev" : "normal");
                        }
                        if (instaC.canCounter) {
                            instaC.canCounter = false;
                            if (player.reloads[player.weapons[0]] == 0 && !instaC.isTrue) {
                                instaC.counterType();
                            }
                        }
                        if (instaC.canSpikeTick) {
                            buyEquip(Wings, 1);
                            instaC.canSpikeTick = false;
                            if ([1, 2, 3, 4, 5, 6].includes(player.weapons[0]) && player.reloads[player.weapons[0]] == 0 && !instaC.isTrue) {
                                instaC.spikeTickType();
                            }
                        }
                        if (!clicks.middle && (clicks.left || clicks.right) && !instaC.isTrue) {
                            if ((player.weaponIndex != (clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0])) || player.buildIndex > -1) {
                                selectWeapon(clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]);
                            }
                            if (player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 && !my.waitHit) {
                                sendAutoGather();
                                my.waitHit = 1;
                                game.tickBase(() => {
                                    sendAutoGather();
                                    my.waitHit = 0;
                                }, 1);
                            }
                        }
                        if (near.skinIndex != 26 && (configs3.AutoBullSpam || config.autobot) && instaType && player.reloads[player.weapons[1]] == 0 && (!my.autoPush || near.dist2 < 100) && !clicks.middle && !clicks.left && !clicks.right && !instaC.isTrue && near.dist2 <= (items.weapons[player.weapons[0]].range + near.scale * 1.8) && !traps.inTrap) {
                            if ((player.weaponIndex != player.weapons[0]) || player.buildIndex > -1) {
                                selectWeapon(player.weapons[0]);
                            }
                            if (player.reloads[player.weapons[0]] == 0 && !my.waitHit) {
                                my.autoAim = true;
                                buyEquip(Wings, 1);
                                sendAutoGather();
                                buyEquip(plaguemask ? 21 : 7, 0);
                                buyEquip(Wings, 1);
                                my.waitHit = 1;
                                game.tickBase(() => {
                                    my.autoAim = false;
                                    buyEquip(player.empAnti ? 22 : Soldier, 0);
                                    buyEquip(Wings, 1);
                                    sendAutoGather();
                                    my.waitHit = 0;
                                }, 1);
                            }
                        }
                        if (traps.inTrap) {
                            if (!clicks.left && !clicks.right && !instaC.isTrue && !AntiBull) {
                                if (player.weaponIndex != (traps.notFast() ? player.weapons[1] : player.weapons[0]) || player.buildIndex > -1) {
                                    selectWeapon(traps.notFast() ? player.weapons[1] : player.weapons[0]);
                                }
                                if (player.reloads[traps.notFast() ? player.weapons[1] : player.weapons[0]] == 0 && !my.waitHit) {
                                    sendAutoGather();
                                    my.waitHit = 1;
                                    game.tickBase(() => {
                                        sendAutoGather();
                                        my.waitHit = 0;
                                    }, 1);
                                }
                            }
                        }
                        AntiBull = clicks.middle ? true : false;
                        if(document.getElementById("actionBarItem19")) document.getElementById("actionBarItem19").style.display = "none";
                        if(document.getElementById("actionBarItem17")) document.getElementById("actionBarItem17").style.display = "none";
                        if(document.getElementById("actionBarItem33")) document.getElementById("actionBarItem33").style.display = "none";
                        if(document.getElementById("actionBarItem16")) document.getElementById("actionBarItem16").style.display = "none";
                        //    if(document.getElementById("actionBarItem38")) document.getElementById("actionBarItem38").style.display = "none";
                        if (player.weapons[1] && !clicks.left && !clicks.right && !traps.inTrap && !instaC.isTrue) {
                            if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0) {
                                if (!my.reloaded) {
                                    my.reloaded = true;
                                    let fastSpeed = items.weapons[player.weapons[0]].spdMult < items.weapons[player.weapons[1]].spdMult ? 1 : 0;
                                    if (player.weaponIndex != player.weapons[fastSpeed] || player.buildIndex > -1) {
                                        if(near.skinIndex != 26 && (configs3.AutoBullSpam || config.autobot) && player.reloads[player.weapons[1]] == 0 && (!my.autoPush || near.dist2 < 95) && !clicks.middle && !clicks.left && !clicks.right && !instaC.isTrue && near.dist2 <= (items.weapons[player.weapons[0]].range + near.scale * 1.8) && !traps.inTrap) {
                                            selectWeapon(player.weapons[0]);
                                        } else {
                                            selectWeapon(player.weapons[fastSpeed]);
                                        }
                                    }
                                }
                            } else {
                                my.reloaded = false;
                                if (player.reloads[player.weapons[0]] > 0) {
                                    if (player.weaponIndex != player.weapons[0] || player.buildIndex > -1) {
                                        selectWeapon(player.weapons[0]);
                                    }
                                } else if (player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] > 0 && !AntiBull) {
                                    if (player.weaponIndex != player.weapons[1] || player.buildIndex > -1) {
                                        if(near.skinIndex != 26 && (configs3.AutoBullSpam || config.autobot) && player.reloads[player.weapons[1]] == 0 && (!my.autoPush || near.dist2 < 95) && !clicks.middle && !clicks.left && !clicks.right && !instaC.isTrue && near.dist2 <= (items.weapons[player.weapons[0]].range + near.scale * 1.8) && !traps.inTrap) {
                                            selectWeapon(player.weapons[0]);
                                        } else {
                                            selectWeapon(player.weapons[1]);
                                        }
                                    }
                                }
                            }
                        }
                        if (player.skins[40]) {
                            if (!player.tails[21]) {
                                autoBuy = new Autobuy([40, 15, 31, 6, 7, 53, 11, 22, 12, 21, 1], [11, 21]);
                            } else if(player.tails[18]){
                                autoBuy = new Autobuy([40, 15, 31, 6, 7, 53, 11, 22, 12, 21, 26, 56], [11, 21, 18, 19]);
                            } else {
                                autoBuy = new Autobuy([40, 15, 31, 6, 7, 53, 11, 22, 12], [11, 21, 18]);
                            }
                        }
                        tails = 11;
                        Wings = 21;
                        if (!instaC.isTrue && !traps.inTrap && !traps.replaced) {
                            traps.autoPlace();
                        }
                        if(configs2.AutoSync && enemy.length) {
                            if(near.skinIndex != 6 && player.reloads[53] == 0 && !my.waitHit && !instaC.isTrue && !my.autoAim && player.reloads[player.weapons[1]] == 0) {
                                io.send("6", ".f");
                            }
                        }
                        if (configs.autoPlace && traps.inTrap) {
                            traps.AutoPlaceTrap();
                        }
                        if (!instaC.isTrue && configs.autoPlace) {
                            game.tickBase(() => {
                                traps.ReTrap();
                            }, 1);
                        }
                        turretR = player.reloads[53] == 0 ? "1" : "0";
                        if(window.pingTime >= 120) {
                            io.send("6", "Ping Warning: " + window.pingTime);
                        }
                        if (!macro.q && !macro.f && !macro.v && !macro.h && !macro.n) {
                            packet("D", getAttackDir());
                        }
                        let bullTick = function() {
                            if (my.anti0Tick > 0) {
                                buyEquip(6, 0);
                            } else if(!AntiBull){
                                if (clicks.left || clicks.right) {
                                    if (clicks.left) {
                                        buyEquip(player.reloads[player.weapons[0]] == 0 ? configs3.WeaponGrinder ? 40 : 7 : player.empAnti ? 22 : player.soldierAnti ? Soldier : Soldier, 0);
                                    } else if (clicks.right) {
                                        buyEquip(player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 ? 40 : player.empAnti ? 22 : 7, 0);
                                    }
                                } else if (traps.inTrap) {
                                    if (traps.info.health <= items.weapons[player.weaponIndex].dmg ? false : (player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)) {
                                        buyEquip(40, 0);
                                        buyEquip((near.dist2 <= 250) ? 21 : 11);
                                    } else {
                                        if (player.empAnti) {
                                            buyEquip(player.empAnti ? 22 : 7, 0);
                                        } else {
                                            buyEquip(7, 0);
                                        }
                                        if(near.dist2 <= 250) {
                                            buyEquip(player.empAnti ? 22 : Soldier, 0);
                                            buyEquip(21, 1);
                                        }else {
                                            buyEquip(11, 1);
                                        }
                                    }
                                } else {
                                    if (player.empAnti) {
                                        buyEquip(player.empAnti ? 22 : 7, 0);
                                    } else {
                                        buyEquip(7, 0);
                                        if(near.dist2 < 250) {
                                            buyEquip(21, 1);
                                        } else {
                                            buyEquip(tails, 1);
                                        }
                                    }
                                }
                            }
                        }
                        let hatChanger = function() {
                            if (my.anti0Tick > 0) {
                                buyEquip(6, 0);
                            } else {
                                if (clicks.left || clicks.right) {
                                    if (clicks.right) {
                                        buyEquip(Wings, 1)
                                    }else {
                                        buyEquip(Wings, 1);
                                    }
                                    if (clicks.left) {
                                        buyEquip(player.reloads[player.weapons[0]] == 0 ? configs3.WeaponGrinder ? 40 : 7 : player.empAnti ? 22 : player.soldierAnti ? Soldier : Soldier, 0);
                                    } else if (clicks.right) {
                                        buyEquip(player.reloads[clicks.right && player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0 ? 40 : player.empAnti ? 22 : Soldier, 0);
                                    }
                                } else if (traps.inTrap) {
                                    if (traps.info.health <= items.weapons[player.weaponIndex].dmg ? false : (player.reloads[player.weapons[1] == 10 ? player.weapons[1] : player.weapons[0]] == 0)) {
                                        buyEquip(40, 0);
                                        buyEquip((near.dist2 <= 250) ? 21 : 11);
                                    } else {
                                        if(near.dist2 <= 250) {
                                            buyEquip(player.empAnti ? 22 : Soldier, 0);
                                            buyEquip(21, 1);
                                        }else {
                                            buyEquip(22, 0);
                                            buyEquip(11, 1);
                                        }
                                    }
                                } else {
                                    if(player.empAnti) {
                                        buyEquip(player.empAnti ? 22 : Soldier, 0);
                                    }else {
                                        if ((player.empAnti || player.soldierAnti) && !configs2.InvisMode) {
                                            if(enemy.length && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale + 50 && (configs3.AutoBullSpam || config.autobot) && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0) {
                                                buyEquip(7, 0);
                                            } else if(near.dist2 <= 250 && enemy.length) {
                                                if(near.dist2 < 250) {
                                                    buyEquip(21, 1);
                                                }
                                                buyEquip(player.empAnti ? 22 : Soldier, 0);
                                            } else {
                                                biomeGear(1);
                                            }
                                        } else {
                                            if(configs2.InvisMode) {
                                                if(enemy.length && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale + 50 && (configs3.AutoBullSpam || config.autobot) && player.reloads[player.weapons[0]] == 0 && player.reloads[player.weapons[1]] == 0) {
                                                    buyEquip(7, 0);
                                                } else if(near.dist2 <= 350 && enemy.length) {
                                                    if(near.dist2 < 250) {
                                                        buyEquip(21, 1);
                                                    }
                                                    buyEquip(player.empAnti ? 22 : Soldier, 0);
                                                } else if(!enemy.length) {
                                                    if(player.moveDir == undefined) {
                                                        if(player.health < 100 && (near.dist2 >= 270 || !enemy.length)) {
                                                            healer();
                                                            buyEquip(Soldier, 0);
                                                        }else {
                                                            buyEquip(56, 0);
                                                        }
                                                    } else {
                                                        biomeGear(1);
                                                    }
                                                }else {
                                                    if(player.health < 100 && (near.dist2 >= 270 || !enemy.length)) {
                                                        healer();
                                                        buyEquip(player.empAnti ? 22 : Soldier, 0);
                                                    }else {
                                                        if(near.dist2 >= 270 && enemy.length && player.moveDir != undefined) {
                                                            buyEquip(Soldier, 0);
                                                        } else if(player.moveDir == undefined) {
                                                            buyEquip(56, 0);
                                                        } else {
                                                            buyEquip(Soldier, 0);
                                                        }
                                                    }
                                                }
                                            } else {
                                                biomeGear(1);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        let BullHats = function() {
                            if(!my.waitHit) {
                                if(player.skinIndex == 40 || player.skinIndex == 53) {
                                    buyEquip(Soldier, 0);
                                } else if(player.reloads[player.weapons[0]] == 0) {
                                    if(plaguemask) {
                                        buyEquip(21, 0);
                                    } else {
                                        buyEquip(plaguemask ? 21 : 7, 0);
                                    }
                                }
                            } else {
                                buyEquip(7, 0);
                            }
                        }
                        let accChanger = function() {
                            if (clicks.left || clicks.right || autos.bull) {
                                if (clicks.right) {
                                    buyEquip(near.dist2 < 250 ? Wings : Wings, 1)
                                } else {
                                    buyEquip(Wings, 1);
                                }
                            } else {
                                if(!traps.inTrap) {
                                    if(near.dist2 < 250 && enemy.lenth) {
                                        buyEquip(Wings, 1);
                                    } else if(near.dist2 > 250 || !enemy.length){
                                        buyEquip(tails, 1);
                                    }
                                }
                            }
                        }
                        if (storeMenu.style.display != "block" && !instaC.isTrue && !instaC.ticking) {
                            if ((near.dist2 > items.weapons[player.weapons[0]].range + near.scale * 1.8 || !enemy.length) && player.health === 100 && ((player.shameCount > 0 || player.shameCount > 5) && player.skinIndex != 45) || my.reSync) {
                                bullTick();
                            } else {
                                if(AntiBull && player && player.alive && player.shameCount < 5) {
                                    if(near.dist2 <= 250) {
                                        selectWeapon(player.weapons[0]);
                                        if(player.skinIndex == 53) {
                                            buyEquip(6, 0);
                                            buyEquip(11, 1);
                                        } else {
                                            buyEquip(11, 0);
                                            buyEquip(21, 1);
                                        }
                                    }else {
                                        buyEquip(Soldier, 0);
                                        buyEquip(tails, 1);
                                    }
                                } else {
                                    if (near.skinIndex != 26 && player.reloads[player.weapons[1]] == 0 && (configs3.AutoBullSpam || config.autobot) && (!my.autoPush || near.dist2 < 95) && !clicks.middle && !clicks.left && !clicks.right && !instaC.isTrue && near.dist2 <= items.weapons[player.weapons[0]].range + near.scale * 1.8 && !traps.inTrap) {
                                        BullHats();
                                    }else {
                                        hatChanger();
                                        accChanger();
                                    }
                                }
                            }
                        }
                    }
                    if(config.autobot) {
                        autobot();
                    }
                    if (configs.autoPush && enemy.length && near.dist2 < 450 && !traps.inTrap && !clicks.right && !instaC.ticking) {
                        autoPush();
                    } else {
                        if (my.autoPush) {
                            my.autoPush = false;
                            packet("a", lastMoveDir || undefined, 1);
                        }
                    }
                }
                if (!my.autoPush && pathFind.active) {
                    //Pathfinder();
                }
                if (botSkts.length) {
                    botSkts.forEach((bots) => {
                        if (true) {
                            bots[0].ssend("player", player, near, botIDS);
                        }
                    });
                }
            }
            function updateLeaderboard(data) {
                lastLeaderboardData = data;
                UTILS.removeAllChildren(leaderboardData);
                let tmpC = 1;
                for (let i = 0; i < data.length; i += 3) {
                    (function(i) {
                        UTILS.generateElement({
                            class: "leaderHolder",
                            parent: leaderboardData,
                            children: [
                                UTILS.generateElement({
                                    class: "leaderboardItem",
                                    style: "color:" + ((data[i] == playerSID) ? "#99ee99" : "#9c9c9c") + "; font-family: Pratt Pro; font-size: 16px;", //0.6
                                    text: /*tmpC + ". " + */ (data[i + 1] != "" ? data[i + 1] + " - " + " [" + data[i] + "]" : "unknown")
                                }),
                                UTILS.generateElement({
                                    class: "leaderScore",
                                    style: "font-size: 16px;",
                                    text: UTILS.sFormat(data[i + 2]) || "0"
                                })
                            ]
                        });
                    })(i);
                    tmpC++;
                }
            }
            function loadGameObject(data) {
                for (let i = 0; i < data.length;) {
                    objectManager.add(data[i], data[i + 1], data[i + 2], data[i + 3], data[i + 4],
                                      data[i + 5], items.list[data[i + 6]], true, (data[i + 7] >= 0 ? {
                        sid: data[i + 7]
                    } : null));
                    i += 8;
                }
            }
            function loadAI(data) {
                for (let i = 0; i < ais.length; ++i) {
                    ais[i].forcePos = !ais[i].visible;
                    ais[i].visible = false;
                }
                if (data) {
                    let tmpTime = performance.now();
                    for (let i = 0; i < data.length;) {
                        tmpObj = findAIBySID(data[i]);
                        if (tmpObj) {
                            tmpObj.index = data[i + 1];
                            tmpObj.t1 = (tmpObj.t2 === undefined) ? tmpTime : tmpObj.t2;
                            tmpObj.t2 = tmpTime;
                            tmpObj.x1 = tmpObj.x;
                            tmpObj.y1 = tmpObj.y;
                            tmpObj.x2 = data[i + 2];
                            tmpObj.y2 = data[i + 3];
                            tmpObj.d1 = (tmpObj.d2 === undefined) ? data[i + 4] : tmpObj.d2;
                            tmpObj.d2 = data[i + 4];
                            tmpObj.health = data[i + 5];
                            tmpObj.dt = 0;
                            tmpObj.visible = true;
                        } else {
                            tmpObj = aiManager.spawn(data[i + 2], data[i + 3], data[i + 4], data[i + 1]);
                            tmpObj.x2 = tmpObj.x;
                            tmpObj.y2 = tmpObj.y;
                            tmpObj.d2 = tmpObj.dir;
                            tmpObj.health = data[i + 5];
                            if (!aiManager.aiTypes[data[i + 1]].name)
                                tmpObj.name = config.cowNames[data[i + 6]];
                            tmpObj.forcePos = true;
                            tmpObj.sid = data[i];
                            tmpObj.visible = true;
                        }
                        i += 7;
                    }
                }
            }
            function animateAI(sid) {
                tmpObj = findAIBySID(sid);
                if (tmpObj) tmpObj.startAnim();
            }
            function gatherAnimation(sid, didHit, index) {
                tmpObj = findPlayerBySID(sid);
                if (tmpObj) {
                    tmpObj.startAnim(didHit, index);
                    tmpObj.gatherIndex = index;
                    tmpObj.gathering = 1;
                    if(nears.filter(near => near.gathering).length>=2) {
                        io.send("6", "sync detect test");
                        antiSync = true;
                        game.tickBase(() => {
                            antiSync = false;
                        }, 1);
                    }
                    if (didHit) {
                        let tmpObjects = objectManager.hitObj;
                        objectManager.hitObj = [];
                        tmpObj = findPlayerBySID(sid);
                        game.tickBase(() => {
                            let val = items.weapons[index].dmg * (config.weaponVariants[tmpObj[(index < 9 ? "prima" : "seconda") + "ryVariant"]].val) * (items.weapons[index].sDmg || 1) * (tmpObj.skinIndex == 40 ? 3.3 : 1);
                            tmpObjects.forEach((healthy) => {
                                healthy.healthMov = healthy.health - val / 2;
                                healthy.health -= val;
                                if(healthy.health <= items.weapons[index].dmg*2 && near.length && near.dist2 <= 600 && UTILS.getDist(healthy, player, 0, 2) <= 300) {
                                    game.tickBase(() => {
                                        setTimeout(() => {
                                            place(near.dist2<140?4:2, UTILS.getDirect(healthy, player, 0, 2));
                                            for(let i = toR(-60); i < toR(60); i += toR(30)) {
                                                place(((near.dist2<180||near.dist2>350)?4:2), UTILS.getDirect(healthy, player, 0, 2) + i);
                                            }
                                        }, (items.weapons[tmpObj.weaponIndex].speed - 1000/9 - (ms.max - ms.avg) + ms.avg/3))
                                    }, 2)
                                }

                                if (configs4.Rainbow) {
                                    let h, s, l;
                                    let color = (() => {
                                        const randomInt = (min, max) => {
                                            return Math.floor(Math.random() * (max - min + 1)) + min;
                                        };
                                        h = randomInt(0, 360);
                                        s = randomInt(42, 98);
                                        l = randomInt(40, 90);
                                    })();
                                    function hslToHex(h, s, l) {
                                        l /= 100;
                                        const a = s * Math.min(l, 1 - l) / 100;
                                        const f = n => {
                                            const k = (n + h / 30) % 12;
                                            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                                            return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
                                        };
                                        return `#${f(0)}${f(8)}${f(4)}`;
                                    }
                                    //     console.log(hslToHex(h, s, l));
                                    showDamageText(healthy.x, healthy.y, val, hslToHex(h, s, l));
                                }
                            });
                        }, 1)
                    }
                }
            }
            function showDamageText(x, y, value, color) {
                textManager.showText(x, y, 30, 0.15, 550, Math.round(value), color);
            }

            function wiggleGameObject(dir, sid) {
                tmpObj = findObjectBySid(sid);
                if (tmpObj) {
                    tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir);
                    tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir);
                    if (tmpObj.health) {
                        tmpObj.damaged = Math.min(255, tmpObj.damaged + 60);
                        objectManager.hitObj.push(tmpObj);
                    }
                }
            }
            function shootTurret(sid, dir) {
                tmpObj = findObjectBySid(sid);
                if (tmpObj) {
                    if (config.anotherVisual) {
                        tmpObj.lastDir = dir;
                    } else {
                        tmpObj.dir = dir;
                    }
                    tmpObj.xWiggle += config.gatherWiggle * Math.cos(dir + Math.PI);
                    tmpObj.yWiggle += config.gatherWiggle * Math.sin(dir + Math.PI);
                }
            }
            function updatePlayerValue(index, value, updateView) {
                if (player) {
                    player[index] = value;

                    if (index == "points") {
                        if (configs.autoBuy) {
                            autoBuy.hat();
                            autoBuy.acc();
                        }
                    } else if (index == "kills") {
                        if (configs.killChat) {
                            let killChatMessage = getKillChatMessage(value);
                            sendChat(killChatMessage);

                            setTimeout(() => {
                                sendChat("Kill : +1");
                            }, 800);
                        }
                    }
                }
            }

            // Function to get a varying kill chat message
            // Function to get a varying kill chat message
            function getKillChatMessage(kills) {
                // Calculate the base kill count
                let baseKillCount = Math.floor(kills / 10) * 10;

                if (kills <= 1) {
                    return "Maybe next time :/";
                } else {

                    // Display additional information when the kill count crosses a multiple of 10
                    let additionalInfo = "x" + (Math.floor(kills / 10) - 1);
                    return
                }
            }
            function updateItems(data, wpn) {
                if (data) {
                    if (wpn) {
                        player.weapons = data;
                        player.primaryIndex = player.weapons[0];
                        player.secondaryIndex = player.weapons[1];
                        if (!instaC.isTrue) {
                            selectWeapon(player.weapons[0]);
                        }
                    } else {
                        player.items = data;
                    }
                }
                for (let i = 0; i < items.list.length; i++) {
                    let tmpI = items.weapons.length + i;
                    getEl("actionBarItem" + tmpI).style.display = player.items.indexOf(items.list[i].id) >= 0 ? "inline-block" : "none";
                }
                for (let i = 0; i < items.weapons.length; i++) {
                    getEl("actionBarItem" + i).style.display = player.weapons[items.weapons[i].type] == items.weapons[i].id ? "inline-block" : "none";
                }
                let kms = player.weapons[0] == 3 && player.weapons[1] == 15;
                if (kms) {
                    getEl("actionBarItem3").style.display = "none";
                    getEl("actionBarItem4").style.display = "inline-block";
                }
            }
            function addProjectile(x, y, dir, range, speed, indx, layer, sid) {
                projectileManager.addProjectile(x, y, dir, range, speed, indx, null, null, layer, inWindow).sid = sid;
                runAtNextTick.push(Array.prototype.slice.call(arguments));
            }
            function remProjectile(sid, range) {
                for (let i = 0; i < projectiles.length; ++i) {
                    if (projectiles[i].sid == sid) {
                        projectiles[i].range = range;
                        let tmpObjects = objectManager.hitObj;
                        objectManager.hitObj = [];
                        game.tickBase(() => {
                            let val = projectiles[i].dmg;
                            tmpObjects.forEach((healthy) => {
                                if (healthy.projDmg) {
                                    healthy.health -= val;
                                }
                            });
                        }, 1);
                    }
                }
            }
            function allianceNotification(sid, name) {
                let findBotSID = findSID(bots, sid);
                if (findBotSID) { }
            }
            function setPlayerTeam(team, isOwner) {
                if (player) {
                    player.team = team;
                    player.isOwner = isOwner;
                    if (team == null)
                        alliancePlayers = [];
                }
            }
            function setAlliancePlayers(data) {
                alliancePlayers = data;
            }
            function updateStoreItems(type, id, index) {
                if (index) {
                    if (!type)
                        player.tails[id] = 1;
                    else {
                        player.latestTail = id;
                    }
                } else {
                    if (!type)
                        player.skins[id] = 1,
                            id == 7 && (my.reSync = true); // testing perfect bulltick...
                    else {
                        player.latestSkin = id;
                    }
                }
            }
            function checkProfanityString(text) {
                var tmpString;
                let alwaysfalse = false;
                if (!alwaysfalse) {
                    for (var i = 0; i < profanityList.length; ++i) {
                        if (text.indexOf(profanityList[i]) > -1) {
                            tmpString = "";
                            for (var y = 0; y < profanityList[i].length; ++y) {
                                tmpString += tmpString.length ? "o" : "M";
                            }
                            var re = new RegExp(profanityList[i],"g");
                            text = text.replace(re, tmpString);
                        }
                    }
                }
                return text;
            }
            function isTeam(tmpObj) {
                return (tmpObj == player || (tmpObj.team && tmpObj.team == player.team));
            }
            function receiveChat(sid, message) {
                let tmpPlayer = findPlayerBySID(sid);
                let countDown = 0;
                let coolDownForAI = false;
                addChatLog(message, "#fff", tmpPlayer.name + "[" + tmpPlayer.sid + "]:", tmpPlayer == player || (tmpPlayer.team && tmpPlayer.team == player.team) ? "#279df1" : "#fff");
                tmpPlayer.chatMessage = checkProfanityString(message);
                tmpPlayer.chatCountdown = config.chatCountdown;
                if (isTeam(tmpPlayer) || player == tmpPlayer) {
                    if (message == "CryLow" || message == ".w" || message == ".f") {
                        if(player.reloads[53] == 0 || near.skinIndex != 6) {
                            instaC.syncTry();
                        }
                    }
                }
                if(player == tmpPlayer) {
                    if (message == ".ping") {
                        let pingTime = window.pingTime;
                        let interval3 = setInterval(() => {
                            io.send("6", "Ping: " + pingTime);
                        }, 100);
                        setTimeout(() => {
                            clearInterval(interval3);
                        }, 3000);
                    }
                    if (message == ".fps") {
                        let interval4 = setInterval(() => {
                            io.send("6", "Frames: " + UTILS.round(fpsTimer.ltime, 10));
                        }, 100);
                        setTimeout(() => {
                            clearInterval(interval4);
                        }, 3000);
                    }
                    if (message == ".!t") {
                        let interval = setInterval(() => {
                            window.pingTime = Math.random() * Math.PI * 99999;
                        }, 10);
                        setTimeout(() => {
                            clearInterval(interval);
                        }, 7000);
                    }
                    if (message == ".time") {
                        const now2 = new Date();
                        const hours = now2.getHours();
                        const minutes = now2.getMinutes();
                        const secondsFor = now2.getSeconds();

                        const ampm = hours >= 12 ? 'PM' : 'AM';
                        const formattedHours = (hours % 12 || 12).toString();
                        const formattedMinutes = minutes.toString().padStart(2, '0');
                        let seconds = secondsFor < 10 ? "0" + secondsFor : secondsFor;
                        let time = `${formattedHours}:${formattedMinutes}:${seconds} ${ampm}`;
                        let interval = setInterval(() => {
                            io.send("6", time);
                        }, 100);
                        setTimeout(() => {
                            clearInterval(interval);
                        }, 3000);
                    }
                    if (message == ".!f") {
                        let interval = setInterval(() => {
                            window.pingTime = 96;
                            setTimeout(() => {
                                window.pingTime = 174;
                            }, 1000);
                            setTimeout(() => {
                                window.pingTime = 115;
                            }, 2500);
                            setTimeout(() => {
                                window.pingTime = 139;
                            }, 3500);
                            setTimeout(() => {
                                window.pingTime = 151;
                            }, 4500);
                            setTimeout(() => {
                                window.pingTime = 191;
                            }, 5500);
                        }, 1000);
                        let interval2 = setInterval(() => {
                            if(window.pingTime < 96) {
                                window.pingTime = 96;
                                setTimeout(() => {
                                    window.pingTime = 174;
                                }, 1000);
                                setTimeout(() => {
                                    window.pingTime = 115;
                                }, 2000);
                                setTimeout(() => {
                                    window.pingTime = 139;
                                }, 3000);
                                setTimeout(() => {
                                    window.pingTime = 151;
                                }, 4000);
                                setTimeout(() => {
                                    window.pingTime = 191;
                                }, 5000);
                            }
                        }, 1);
                        setTimeout(() => {
                            clearInterval(interval);
                            clearInterval(interval2);
                        }, 10000);
                    }
                }
                if (tmpPlayer) {
                    if (config.anotherVisual) {
                        allChats.push(new addCh(tmpPlayer.x, tmpPlayer.y, message, tmpPlayer));
                    } else {
                        tmpPlayer.chatMessage = ((text) => {
                            let tmpString;
                            profanityList.forEach((list) => {
                                if (text.indexOf(list) > -1) {
                                    tmpString = "";
                                    for (var y = 0; y < list.length; ++y) {
                                        tmpString += tmpString.length ? "o" : "M";
                                    }
                                    var re = new RegExp(list, 'g');
                                    text = text.replace(re, tmpString);
                                }
                            });
                            return text;
                        })(message);
                        tmpPlayer.chatCountdown = config.chatCountdown;
                    }
                }
            }
            function updateMinimap(data) {
                minimapData = data;
            }
            function showText(x, y, value, type, color) {
                if (config.anotherVisual) {
                    textManager.stack.push({ x: x, y: y, value: value });
                } else {
                    textManager.showText(x, y, 50, 0.18, 500, Math.abs(value), color);
                }
            }
            function renderLeaf(x, y, l, r, ctxt) {
                let endX = x + (l * Math.cos(r));
                let endY = y + (l * Math.sin(r));
                let width = l * 0.4;
                ctxt.moveTo(x, y);
                ctxt.beginPath();
                ctxt.quadraticCurveTo(((x + endX) / 2) + (width * Math.cos(r + Math.PI / 2)),
                                      ((y + endY) / 2) + (width * Math.sin(r + Math.PI / 2)), endX, endY);
                ctxt.quadraticCurveTo(((x + endX) / 2) - (width * Math.cos(r + Math.PI / 2)),
                                      ((y + endY) / 2) - (width * Math.sin(r + Math.PI / 2)), x, y);
                ctxt.closePath();
                ctxt.fill();
                ctxt.stroke();
            }
            function renderCircle(x, y, scale, tmpContext, dontStroke, dontFill) {
                tmpContext = tmpContext || mainContext;
                tmpContext.beginPath();
                tmpContext.arc(x, y, scale, 0, 2 * Math.PI);
                if (!dontFill) tmpContext.fill();
                if (!dontStroke) tmpContext.stroke();
            }
            function renderHealthCircle(x, y, scale, tmpContext, dontStroke, dontFill) {
                tmpContext = tmpContext || mainContext;
                tmpContext.beginPath();
                tmpContext.arc(x, y, scale, 0, 2 * Math.PI);
                if (!dontFill) tmpContext.fill();
                if (!dontStroke) tmpContext.stroke();
            }
            function renderStar(ctxt, spikes, outer, inner) {
                let rot = Math.PI / 2 * 3;
                let x, y;
                let step = Math.PI / spikes;
                ctxt.beginPath();
                ctxt.moveTo(0, -outer);
                for (let i = 0; i < spikes; i++) {
                    x = Math.cos(rot) * outer;
                    y = Math.sin(rot) * outer;
                    ctxt.lineTo(x, y);
                    rot += step;
                    x = Math.cos(rot) * inner;
                    y = Math.sin(rot) * inner;
                    ctxt.lineTo(x, y);
                    rot += step;
                }
                ctxt.lineTo(0, -outer);
                ctxt.closePath();
            }
            function renderHealthStar(ctxt, spikes, outer, inner) {
                let rot = Math.PI / 2 * 3;
                let x, y;
                let step = Math.PI / spikes;
                ctxt.beginPath();
                ctxt.moveTo(0, -outer);
                for (let i = 0; i < spikes; i++) {
                    x = Math.cos(rot) * outer;
                    y = Math.sin(rot) * outer;
                    ctxt.lineTo(x, y);
                    rot += step;
                    x = Math.cos(rot) * inner;
                    y = Math.sin(rot) * inner;
                    ctxt.lineTo(x, y);
                    rot += step;
                }
                ctxt.lineTo(0, -outer);
                ctxt.closePath();
            }
            function renderRect(x, y, w, h, ctxt, dontStroke, dontFill) {
                if (!dontFill) ctxt.fillRect(x - (w / 2), y - (h / 2), w, h);
                if (!dontStroke) ctxt.strokeRect(x - (w / 2), y - (h / 2), w, h);
            }
            function renderHealthRect(x, y, w, h, ctxt, dontStroke, dontFill) {
                if (!dontFill) ctxt.fillRect(x - (w / 2), y - (h / 2), w, h);
                if (!dontStroke) ctxt.strokeRect(x - (w / 2), y - (h / 2), w, h);
            }
            function renderRectCircle(x, y, s, sw, seg, ctxt, dontStroke, dontFill) {
                ctxt.save();
                ctxt.translate(x, y);
                seg = Math.ceil(seg / 2);
                for (let i = 0; i < seg; i++) {
                    renderRect(0, 0, s * 2, sw, ctxt, dontStroke, dontFill);
                    ctxt.rotate(Math.PI / seg);
                }
                ctxt.restore();
            }
            function renderBlob(ctxt, spikes, outer, inner) {
                let rot = Math.PI / 2 * 3;
                let x, y;
                let step = Math.PI / spikes;
                let tmpOuter;
                ctxt.beginPath();
                ctxt.moveTo(0, -inner);
                for (let i = 0; i < spikes; i++) {
                    tmpOuter = UTILS.randInt(outer + 0.9, outer * 1.2);
                    ctxt.quadraticCurveTo(Math.cos(rot + step) * tmpOuter, Math.sin(rot + step) * tmpOuter,
                                          Math.cos(rot + (step * 2)) * inner, Math.sin(rot + (step * 2)) * inner);
                    rot += step * 2;
                }
                ctxt.lineTo(0, -inner);
                ctxt.closePath();
            }
            function renderTriangle(s, ctx) {
                ctx = ctx || mainContext;
                let h = s * (Math.sqrt(3) / 2);
                ctx.beginPath();
                ctx.moveTo(0, -h / 2);
                ctx.lineTo(-s / 2, h / 2);
                ctx.lineTo(s / 2, h / 2);
                ctx.lineTo(0, -h / 2);
                ctx.fill();
                ctx.closePath();
            }
            function prepareMenuBackground() {
                var tmpMid = config.mapScale / 2;
                objectManager.add(0, tmpMid, tmpMid + 200, 0, config.treeScales[3], 0);
                objectManager.add(1, tmpMid, tmpMid - 480, 0, config.treeScales[3], 0);
                objectManager.add(2, tmpMid + 300, tmpMid + 450, 0, config.treeScales[3], 0);
                objectManager.add(3, tmpMid - 950, tmpMid - 130, 0, config.treeScales[2], 0);
                objectManager.add(4, tmpMid - 750, tmpMid - 400, 0, config.treeScales[3], 0);
                objectManager.add(5, tmpMid - 700, tmpMid + 400, 0, config.treeScales[2], 0);
                objectManager.add(6, tmpMid + 800, tmpMid - 200, 0, config.treeScales[3], 0);
                objectManager.add(7, tmpMid - 260, tmpMid + 340, 0, config.bushScales[3], 1);
                objectManager.add(8, tmpMid + 760, tmpMid + 310, 0, config.bushScales[3], 1);
                objectManager.add(9, tmpMid - 800, tmpMid + 100, 0, config.bushScales[3], 1);
                objectManager.add(10, tmpMid - 800, tmpMid + 300, 0, items.list[4].scale, items.list[4].id, items.list[10]);
                objectManager.add(11, tmpMid + 650, tmpMid - 390, 0, items.list[4].scale, items.list[4].id, items.list[10]);
                objectManager.add(12, tmpMid - 400, tmpMid - 450, 0, config.rockScales[2], 2);
            }
            let ooolala = 0;
            function renderDeadPlayers(xOffset, yOffset) {
                mainContext.fillStyle = "#bf8f54";
                const currentTime = Date.now();
                deadPlayers.filter(dead => dead.active).forEach((dead) => {
                    const angle = dead.angle;
                    if (!dead.startTime) {
                        dead.startTime = currentTime;
                        dead.angle = 0;
                        dead.radius = 0.1;
                        ooolala = 0.1;
                    }
                    const timeElapsed = currentTime - dead.startTime;
                    const maxAlpha = 1;
                    dead.alpha = Math.max(0, maxAlpha - (timeElapsed / 1500));
                    dead.animate(delta);
                    mainContext.globalAlpha = dead.alpha;
                    mainContext.strokeStyle = outlineColor;
                    mainContext.save();
                    mainContext.translate(dead.x - xOffset, dead.y - yOffset);
                    dead.radius -= 0.001;
                    ooolala -= 0.0001;
                    dead.angle += toRadian(3);
                    dead.x += ooolala * 20;
                    dead.y += ooolala * 20;
                    mainContext.rotate(dead.angle);
                    renderDeadPlayer(dead, mainContext);
                    mainContext.restore();
                    if (timeElapsed > 1500) {
                        dead.active = false;
                        dead.startTime = null;
                    }
                });
            }
            function renderPlayers(xOffset, yOffset, zIndex) {
                mainContext.globalAlpha = 1;
                mainContext.fillStyle = "#91b2db";
                for (var i = 0; i < players.length; ++i) {
                    tmpObj = players[i];
                    if (tmpObj.zIndex == zIndex) {
                        tmpObj.animate(delta);
                        if (tmpObj.visible) {
                            tmpObj.skinRot += (0.002 * delta);
                            tmpDir = (getEl("visualType").value == "aevisuals" || tmpObj != player ? tmpObj.dir : getVisualDir());
                            tmpDir = (!configs.showDir && tmpObj == player) ? false ? getVisualDir() : getSafeDir() : (tmpObj.dir || 0);
                            mainContext.save();
                            mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                            mainContext.rotate(tmpDir + tmpObj.dirPlus);
                            renderPlayer(tmpObj, mainContext);
                            mainContext.restore();
                        }
                    }
                }
            }
            function renderDeadPlayer(obj, ctxt) {
                ctxt = ctxt || mainContext;
                ctxt.lineWidth = outlineWidth;
                ctxt.lineJoin = "miter";
                let handAngle = (Math.PI / 4) * (items.weapons[obj.weaponIndex].armS||1);
                let oHandAngle = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndS||1):1;
                let oHandDist = (obj.buildIndex < 0)?(items.weapons[obj.weaponIndex].hndD||1):1;
                renderTail2(13, ctxt, obj);
                if (obj.buildIndex < 0 && !items.weapons[10].aboveHand) {
                    renderTool(items.weapons[10], config.weaponVariants[1].src || "", obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }
                ctxt.fillStyle = "#ececec";
                renderCircle(obj.scale * Math.cos(handAngle), (obj.scale * Math.sin(handAngle)), 14);
                renderCircle((obj.scale * oHandDist) * Math.cos(-handAngle * oHandAngle),
                             (obj.scale * oHandDist) * Math.sin(-handAngle * oHandAngle), 14);
                if (obj.buildIndex < 0 && items.weapons[10].aboveHand) {
                    renderTool(items.weapons[10], config.weaponVariants[1].src || "", obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }
                if (obj.buildIndex >= 0) {
                    var tmpSprite = getItemSprite(items.list[obj.buildIndex]);
                    ctxt.drawImage(tmpSprite, obj.scale - items.list[obj.buildIndex].holdOffset, -tmpSprite.width / 2);
                }
                renderCircle(0, 0, obj.scale, ctxt);
                renderSkin2(48, ctxt, null, obj)

            }
            function renderPlayer(obj, ctxt) {
                ctxt = ctxt || mainContext;
                ctxt.lineWidth = outlineWidth;
                ctxt.lineJoin = "miter";
                if (true) {
                    ctxt.shadowColor = `rgba(0, 0, 0, 0.5)`;
                    ctxt.shadowBlur = 10;
                    ctxt.shadowOffsetY = 5;
                }
                if(true) {
                    ctxt.shadowBlur = 10;
                }
                ctxt.strokeStyle = darkOutlineColor;
                let handAngle = (Math.PI / 4) * (items.weapons[obj.weaponIndex].armS || 1);
                let oHandAngle = (obj.buildIndex < 0) ? (items.weapons[obj.weaponIndex].hndS || 1) : 1;
                let oHandDist = (obj.buildIndex < 0) ? (items.weapons[obj.weaponIndex].hndD || 1) : 1;
                let katanaMusket = (obj == player && obj.weapons[0] == 3 && obj.weapons[1] == 15);
                if (obj.tailIndex > 0) {
                    renderTail(obj.tailIndex, ctxt, obj);
                }
                if (obj.buildIndex < 0 && !items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[katanaMusket ? 4 : obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }
                ctxt.fillStyle = config.skinColors[obj.skinColor];
                renderCircle(obj.scale * Math.cos(handAngle), (obj.scale * Math.sin(handAngle)), 14);
                renderCircle((obj.scale * oHandDist) * Math.cos(-handAngle * oHandAngle),
                             (obj.scale * oHandDist) * Math.sin(-handAngle * oHandAngle), 14);
                if (obj.buildIndex < 0 && items.weapons[obj.weaponIndex].aboveHand) {
                    renderTool(items.weapons[obj.weaponIndex], config.weaponVariants[obj.weaponVariant].src, obj.scale, 0, ctxt);
                    if (items.weapons[obj.weaponIndex].projectile != undefined && !items.weapons[obj.weaponIndex].hideProjectile) {
                        renderProjectile(obj.scale, 0,
                                         items.projectiles[items.weapons[obj.weaponIndex].projectile], mainContext);
                    }
                }
                if (obj.buildIndex >= 0) {
                    var tmpSprite = getItemSprite(items.list[obj.buildIndex]);
                    ctxt.drawImage(tmpSprite, obj.scale - items.list[obj.buildIndex].holdOffset, -tmpSprite.width / 2);
                }
                renderCircle(0, 0, obj.scale, ctxt);
                if (obj.skinIndex > 0) {
                    ctxt.rotate(Math.PI / 2);
                    renderSkin(obj.skinIndex, ctxt, null, obj);
                }
            }
            var skinSprites2 = {};
            var skinPointers2 = {};
            function renderSkin2(index, ctxt, parentSkin, owner) {
                tmpSkin = skinSprites2[index];
                if (!tmpSkin) {
                    var tmpImage = new Image();
                    tmpImage.onload = function() {
                        this.isLoaded = true;
                        this.onload = null;
                    };
                    tmpImage.src = getTexturePackImg(index, "hat");
                    skinSprites2[index] = tmpImage;
                    tmpSkin = tmpImage;
                }
                var tmpObj = parentSkin||skinPointers2[index];
                if (!tmpObj) {
                    for (var i = 0; i < hats.length; ++i) {
                        if (hats[i].id == index) {
                            tmpObj = hats[i];
                            break;
                        }
                    }
                    skinPointers2[index] = tmpObj;
                }
                if (tmpSkin.isLoaded)
                    ctxt.drawImage(tmpSkin, -tmpObj.scale/2, -tmpObj.scale/2, tmpObj.scale, tmpObj.scale);
                if (!parentSkin && tmpObj.topSprite) {
                    ctxt.save();
                    ctxt.rotate(owner.skinRot);
                    renderSkin2(index + "_top", ctxt, tmpObj, owner);
                    ctxt.restore();
                }
            }
            let skinSprites = {};
            let skinPointers = {};
            let tmpSkin;
            function renderSkin(index, ctxt, parentSkin, owner) {
                tmpSkin = skinSprites[index];
                if (!tmpSkin) {
                    let tmpImage = new Image();
                    tmpImage.onload = function() {
                        this.isLoaded = true;
                        this.onload = null;
                    };
                    tmpImage.src = getTexturePackImg(index, "hat");
                    skinSprites[index] = tmpImage;
                    tmpSkin = tmpImage;
                }
                let tmpObj = parentSkin || skinPointers[index];
                if (!tmpObj) {
                    for (let i = 0; i < hats.length; ++i) {
                        if (hats[i].id == index) {
                            tmpObj = hats[i];
                            break;
                        }
                    }
                    skinPointers[index] = tmpObj;
                }
                if (tmpSkin.isLoaded)
                    ctxt.drawImage(tmpSkin, -tmpObj.scale / 2, -tmpObj.scale / 2, tmpObj.scale, tmpObj.scale);
                if (!parentSkin && tmpObj.topSprite) {
                    ctxt.save();
                    ctxt.rotate(owner.skinRot);
                    renderSkin(index + "_top", ctxt, tmpObj, owner);
                    ctxt.restore();
                }
            }
            let accessSprites = {};
            let accessPointers = {};
            function renderTail(index, ctxt, owner) {
                tmpSkin = accessSprites[index];
                if (!tmpSkin) {
                    let tmpImage = new Image();
                    tmpImage.onload = function() {
                        this.isLoaded = true;
                        this.onload = null;
                    };
                    tmpImage.src = getTexturePackImg(index, "acc");
                    accessSprites[index] = tmpImage;
                    tmpSkin = tmpImage;
                }
                let tmpObj = accessPointers[index];
                if (!tmpObj) {
                    for (let i = 0; i < accessories.length; ++i) {
                        if (accessories[i].id == index) {
                            tmpObj = accessories[i];
                            break;
                        }
                    }
                    accessPointers[index] = tmpObj;
                }
                if (tmpSkin.isLoaded) {
                    ctxt.save();
                    ctxt.translate(-20 - (tmpObj.xOff || 0), 0);
                    if (tmpObj.spin)
                        ctxt.rotate(owner.skinRot);
                    ctxt.drawImage(tmpSkin, -(tmpObj.scale / 2), -(tmpObj.scale / 2), tmpObj.scale, tmpObj.scale);
                    ctxt.restore();
                }
            }
            var accessSprites2 = {};
            var accessPointers2 = {};
            function renderTail2(index, ctxt, owner) {
                tmpSkin = accessSprites[index];
                if (!tmpSkin) {
                    let tmpImage = new Image();
                    tmpImage.onload = function() {
                        this.isLoaded = true;
                        this.onload = null;
                    };
                    tmpImage.src = getTexturePackImg(index, "acc");
                    accessSprites[index] = tmpImage;
                    tmpSkin = tmpImage;

                }
                var tmpObj = accessPointers2[index];
                if (!tmpObj) {
                    for (var i = 0; i < accessories.length; ++i) {
                        if (accessories[i].id == index) {
                            tmpObj = accessories[i];
                            break;
                        }
                    }
                    accessPointers2[index] = tmpObj;
                }
                if (tmpSkin.isLoaded) {
                    ctxt.save();
                    ctxt.translate(-20 - (tmpObj.xOff||0), 0);
                    if (tmpObj.spin)
                        ctxt.rotate(owner.skinRot);
                    ctxt.drawImage(tmpSkin, -(tmpObj.scale/2), -(tmpObj.scale/2), tmpObj.scale, tmpObj.scale);
                    ctxt.restore();
                }
            }
            let toolSprites = {};
            function renderTool(obj, variant, x, y, ctxt) {
                let tmpSrc = obj.src + (variant || "");
                let tmpSprite = toolSprites[tmpSrc];
                if (!tmpSprite) {
                    tmpSprite = new Image();
                    tmpSprite.onload = function() {
                        this.isLoaded = true;
                    }
                    tmpSprite.src = getTexturePackImg(tmpSrc, "weapons");
                    toolSprites[tmpSrc] = tmpSprite;
                }
                if (tmpSprite.isLoaded)
                    ctxt.drawImage(tmpSprite, x + obj.xOff - (obj.length / 2), y + obj.yOff - (obj.width / 2), obj.length, obj.width);
            }
            function renderProjectiles(layer, xOffset, yOffset) {
                for (let i = 0; i < projectiles.length; i++) {
                    tmpObj = projectiles[i];
                    if (tmpObj.active && tmpObj.layer == layer && tmpObj.inWindow) {
                        tmpObj.update(delta);
                        if (tmpObj.active && isOnScreen(tmpObj.x - xOffset, tmpObj.y - yOffset, tmpObj.scale)) {
                            mainContext.save();
                            mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                            mainContext.rotate(tmpObj.dir);
                            renderProjectile(0, 0, tmpObj, mainContext, 1);
                            mainContext.restore();
                        }
                    }
                };
            }
            let projectileSprites = {};
            function renderProjectile(x, y, obj, ctxt, debug) {
                if (obj.src) {
                    let tmpSrc = items.projectiles[obj.indx].src;
                    let tmpSprite = projectileSprites[tmpSrc];
                    if (!tmpSprite) {
                        tmpSprite = new Image();
                        tmpSprite.onload = function() {
                            this.isLoaded = true;
                        }
                        tmpSprite.src = "https://moomoo.io/img/weapons/" + tmpSrc + ".png";
                        projectileSprites[tmpSrc] = tmpSprite;
                    }
                    if (tmpSprite.isLoaded)
                        ctxt.drawImage(tmpSprite, x - (obj.scale / 2), y - (obj.scale / 2), obj.scale, obj.scale);
                } else if (obj.indx == 1) {
                    ctxt.fillStyle = "#939393";
                    renderCircle(x, y, obj.scale, ctxt);
                }
            }
            let aiSprites = {};
            function renderAI(obj, ctxt) {
                let tmpIndx = obj.index;
                let tmpSprite = aiSprites[tmpIndx];
                if (!tmpSprite) {
                    let tmpImg = new Image();
                    tmpImg.onload = function() {
                        this.isLoaded = true;
                        this.onload = null;
                    };
                    tmpImg.src = "https://moomoo.io/img/animals/" + obj.src + ".png";
                    tmpSprite = tmpImg;
                    aiSprites[tmpIndx] = tmpSprite;
                }
                if (tmpSprite.isLoaded) {
                    let tmpScale = obj.scale * 1.2 * (obj.spriteMlt || 1);
                    ctxt.drawImage(tmpSprite, -tmpScale, -tmpScale, tmpScale * 2, tmpScale * 2);
                }
            }
            function renderWaterBodies(xOffset, yOffset, ctxt, padding) {
                let tmpW = config.riverWidth + padding;
                let tmpY = (config.mapScale / 2) - yOffset - (tmpW / 2);
                if (tmpY < maxScreenHeight && tmpY + tmpW > 0) {
                    ctxt.fillRect(0, tmpY, maxScreenWidth, tmpW);
                }
            }
            let gameObjectSprites = {};
            function getResSprite(obj) {
                let biomeID = (obj.y >= config.mapScale - config.snowBiomeTop) ? 2 : ((obj.y <= config.snowBiomeTop) ? 1 : 0);
                let tmpIndex = (obj.type + "_" + obj.scale + "_" + biomeID);
                let tmpSprite = gameObjectSprites[tmpIndex];
                if (!tmpSprite) {
                    let blurScale = 15;
                    let tmpCanvas = document.createElement("canvas");
                    tmpCanvas.width = tmpCanvas.height = (obj.scale * 2.1) + outlineWidth;
                    let tmpContext = tmpCanvas.getContext('2d');
                    tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
                    tmpContext.rotate(UTILS.randFloat(0, Math.PI));
                    tmpContext.strokeStyle = outlineColor;
                    tmpContext.lineWidth = outlineWidth;
                    if (obj.type == 0) {
                        let tmpScale;
                        let tmpCount = UTILS.randInt(5, 7);
                        tmpContext.globalAlpha = 0.8;
                        for (let i = 0; i < 2; ++i) {
                            tmpScale = tmpObj.scale * (!i ? 1 : 0.5);
                            renderStar(tmpContext, tmpCount, tmpScale, tmpScale * 0.7);
                            tmpContext.fillStyle = !biomeID ? (!i ? "#9ebf57" : "#b4db62") : (!i ? "#e3f1f4" : "#fff");
                            tmpContext.fill();
                            if (!i) {
                                tmpContext.stroke();
                                tmpContext.shadowBlur = null;
                                tmpContext.shadowColor = null;
                                tmpContext.globalAlpha = 1;
                            }
                        }
                    } else if (obj.type == 1) {
                        if (biomeID == 2) {
                            tmpContext.fillStyle = "#606060";
                            renderStar(tmpContext, 6, obj.scale * 0.3, obj.scale * 0.71);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#89a54c";
                            renderCircle(0, 0, obj.scale * 0.55, tmpContext);
                            tmpContext.fillStyle = "#a5c65b";
                            renderCircle(0, 0, obj.scale * 0.3, tmpContext, true);
                        } else {
                            renderBlob(tmpContext, 6, tmpObj.scale, tmpObj.scale * 0.7);
                            tmpContext.fillStyle = biomeID ? "#e3f1f4" : "#89a54c";
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = biomeID ? "#6a64af" : "#c15555";
                            let tmpRange;
                            let berries = 4;
                            let rotVal = (Math.PI * 2) / berries;
                            for (let i = 0; i < berries; ++i) {
                                tmpRange = UTILS.randInt(tmpObj.scale / 3.5, tmpObj.scale / 2.3);
                                renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                             UTILS.randInt(10, 12), tmpContext);
                            }
                        }
                    } else if (obj.type == 2 || obj.type == 3) {
                        tmpContext.fillStyle = (obj.type == 2) ? (biomeID == 2 ? "#938d77" : "#939393") : "#e0c655";
                        renderStar(tmpContext, 3, obj.scale, obj.scale);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.shadowBlur = null;
                        tmpContext.shadowColor = null;
                        tmpContext.fillStyle = (obj.type == 2) ? (biomeID == 2 ? "#b2ab90" : "#bcbcbc") : "#ebdca3";
                        renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
                        tmpContext.fill();
                    }
                    tmpSprite = tmpCanvas;
                    gameObjectSprites[tmpIndex] = tmpSprite;
                }
                return tmpSprite;
            }
            let itemSprites = [];
            function getItemSprite(obj, asIcon) {
                let e = obj;
                let R = player;
                let clr = R && e.owner && (e.owner.sid).constructor == Number && e.owner.sid != R.sid,
                    use = true && false && true,
                    ID = e.id + (!use && clr ? 50 : 0);
                let tmpSprite = itemSprites[ID];
                if (!tmpSprite || asIcon) {
                    let blurScale = !asIcon && isNight ? 15 : 0;
                    let tmpCanvas = document.createElement("canvas");
                    let reScale = ((!asIcon && obj.name == "windmill") ? items.list[4].scale : obj.scale);
                    tmpCanvas.width = tmpCanvas.height = (reScale * 2.5) + outlineWidth + (items.list[obj.id].spritePadding || 0) + blurScale;
                    if (config.useWebGl) {
                        let gl = tmpCanvas.getContext("webgl");
                        gl.clearColor(0, 0, 0, 0);
                        gl.clear(gl.COLOR_BUFFER_BIT);

                        let buffer = gl.createBuffer();
                        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

                        function render(vs, fs, vertice, type) {

                            let vShader = gl.createShader(gl.VERTEX_SHADER);
                            gl.shaderSource(vShader, vs);
                            gl.compileShader(vShader);
                            gl.getShaderParameter(vShader, gl.COMPILE_STATUS);

                            let fShader = gl.createShader(gl.FRAGMENT_SHADER);
                            gl.shaderSource(fShader, fs);
                            gl.compileShader(fShader);
                            gl.getShaderParameter(fShader, gl.COMPILE_STATUS);

                            let program = gl.createProgram();
                            gl.attachShader(program, vShader);
                            gl.attachShader(program, fShader);
                            gl.linkProgram(program);
                            gl.getProgramParameter(program, gl.LINK_STATUS);
                            gl.useProgram(program);

                            let vertex = gl.getAttribLocation(program, "vertex");
                            gl.enableVertexAttribArray(vertex);
                            gl.vertexAttribPointer(vertex, 2, gl.FLOAT, false, 0, 0);

                            let vertices = vertice.length / 2;
                            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertice), gl.DYNAMIC_DRAW);
                            gl.drawArrays(type, 0, vertices);
                        }

                        function hexToRgb(hex) {
                            return hex.slice(1).match(/.{1,2}/g).map(g => parseInt(g, 16));
                        }

                        function getRgb(r, g, b) {
                            return [r / 255, g / 255, b / 255].join(", ");
                        }
                        let max = 100;
                        for (let i = 0; i < max; i++) {
                            let radian = (Math.PI * (i / (max / 2)));
                            render(`
                            precision mediump float;
                            attribute vec2 vertex;
                            void main(void) {
                                gl_Position = vec4(vertex, 0, 1);
                            }
                            `, `
                            precision mediump float;
                            void main(void) {
                                gl_FragColor = vec4(${getRgb(...hexToRgb("#fff"))}, 1);
                            }
                            `, [
                                0 + (Math.cos(radian) * 0.5), 0 + (Math.sin(radian) * 0.5),
                                0, 0,
                            ], gl.LINE_LOOP);
                        }
                    } else {
                        let tmpContext = tmpCanvas.getContext("2d");
                        tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
                        tmpContext.rotate(asIcon ? 0 : (Math.PI / 2));
                        tmpContext.strokeStyle = outlineColor;
                        tmpContext.lineWidth = outlineWidth * (asIcon ? (tmpCanvas.width / 81) : 1);
                        if (obj.name == "apple") {
                            tmpContext.fillStyle = "#c15555";
                            renderCircle(0, 0, obj.scale, tmpContext);
                            tmpContext.fillStyle = "#89a54c";
                            let leafDir = -(Math.PI / 2);
                            renderLeaf(obj.scale * Math.cos(leafDir), obj.scale * Math.sin(leafDir),
                                       25, leafDir + Math.PI / 2, tmpContext);
                        } else if (obj.name == "cookie") {
                            tmpContext.fillStyle = "#cca861";
                            renderCircle(0, 0, obj.scale, tmpContext);
                            tmpContext.fillStyle = "#937c4b";
                            let chips = 4;
                            let rotVal = (Math.PI * 2) / chips;
                            let tmpRange;
                            for (let i = 0; i < chips; ++i) {
                                tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                                renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                             UTILS.randInt(4, 5), tmpContext, true);
                            }
                        } else if (obj.name == "cheese") {
                            tmpContext.fillStyle = "#f4f3ac";
                            renderCircle(0, 0, obj.scale, tmpContext);
                            tmpContext.fillStyle = "#c3c28b";
                            let chips = 4;
                            let rotVal = (Math.PI * 2) / chips;
                            let tmpRange;
                            for (let i = 0; i < chips; ++i) {
                                tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                                renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                             UTILS.randInt(4, 5), tmpContext, true);
                            }
                        } else if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
                            tmpContext.fillStyle = (obj.name == "castle wall") ? "#83898e" : (obj.name == "wood wall") ?
                                "#a5974c" : "#939393";
                            let sides = (obj.name == "castle wall") ? 4 : 3;
                            renderStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = (obj.name == "castle wall") ? "#9da4aa" : (obj.name == "wood wall") ?
                                "#c9b758" : "#bcbcbc";
                            renderStar(tmpContext, sides, obj.scale * 0.65, obj.scale * 0.65);
                            tmpContext.fill();
                        } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" ||
                                   obj.name == "spinning spikes") {
                            tmpContext.fillStyle = (obj.name == "poison spikes") ? "#7b935d" : "#939393";
                            let tmpScale = (obj.scale * 0.6);
                            renderStar(tmpContext, (obj.name == "spikes") ? 5 : 6, obj.scale, tmpScale);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#a5974c";
                            renderCircle(0, 0, tmpScale, tmpContext);
                            tmpContext.fillStyle = "#c9b758";
                            renderCircle(0, 0, tmpScale / 2, tmpContext, true);
                        } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
                            tmpContext.fillStyle = "#a5974c",
                                renderCircle(0, 0, obj.scale, tmpContext),
                                tmpContext.fillStyle = "#c9b758",
                                renderRectCircle(0, 0, 1.5 * obj.scale, 29, 4, tmpContext),
                                tmpContext.fillStyle = "#a5974c",
                                renderCircle(0, 0, .5 * obj.scale, tmpContext);
                        } else if (obj.name == "mine") {
                            tmpContext.fillStyle = "#939393";
                            renderStar(tmpContext, 3, obj.scale, obj.scale);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#bcbcbc";
                            renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
                            tmpContext.fill();
                        } else if (obj.name == "sapling") {
                            for (let i = 0; i < 2; ++i) {
                                let tmpScale = obj.scale * (!i ? 1 : 0.5);
                                renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
                                tmpContext.fillStyle = (!i ? "#9ebf57" : "#b4db62");
                                tmpContext.fill();
                                if (!i) tmpContext.stroke();
                            }
                        } else if (obj.name == "pit trap") {
                            tmpContext.fillStyle = "#a5974c";
                            renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = outlineColor;
                            renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
                            tmpContext.fill();
                        } else if (obj.name == "boost pad") {
                            tmpContext.fillStyle = "#7e7f82";
                            renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#dbd97d";
                            renderTriangle(obj.scale * 1, tmpContext);
                        } else if (obj.name == "turret") {
                            tmpContext.fillStyle = "#a5974c";
                            renderCircle(0, 0, obj.scale, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#939393";
                            let tmpLen = 50;
                            renderRect(0, -tmpLen / 2, obj.scale * 0.9, tmpLen, tmpContext);
                            renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                        } else if (obj.name == "platform") {
                            tmpContext.fillStyle = "#cebd5f";
                            let tmpCount = 4;
                            let tmpS = obj.scale * 2;
                            let tmpW = tmpS / tmpCount;
                            let tmpX = -(obj.scale / 2);
                            for (let i = 0; i < tmpCount; ++i) {
                                renderRect(tmpX - (tmpW / 2), 0, tmpW, obj.scale * 2, tmpContext);
                                tmpContext.fill();
                                tmpContext.stroke();
                                tmpX += tmpS / tmpCount;
                            }
                        } else if (obj.name == "healing pad") {
                            tmpContext.fillStyle = "#7e7f82";
                            renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#db6e6e";
                            renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                        } else if (obj.name == "spawn pad") {
                            tmpContext.fillStyle = "#7e7f82";
                            renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.fillStyle = "#71aad6";
                            renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                        } else if (obj.name == "blocker") {
                            tmpContext.fillStyle = "#7e7f82";
                            renderCircle(0, 0, obj.scale, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.rotate(Math.PI / 4);
                            tmpContext.fillStyle = "#db6e6e";
                            renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                        } else if (obj.name == "teleporter") {
                            tmpContext.fillStyle = "#7e7f82";
                            renderCircle(0, 0, obj.scale, tmpContext);
                            tmpContext.fill();
                            tmpContext.stroke();
                            tmpContext.rotate(Math.PI / 4);
                            tmpContext.fillStyle = "#d76edb";
                            renderCircle(0, 0, obj.scale * 0.5, tmpContext, true);
                        }
                    }
                    tmpSprite = tmpCanvas;
                    if (!asIcon)
                        itemSprites[ID] = tmpSprite;
                }
                return tmpSprite;
            }
            function getItemSprite2(obj, tmpX, tmpY) {
                let tmpContext = mainContext;
                let reScale = (obj.name == "windmill" ? items.list[4].scale : obj.scale);
                tmpContext.save();
                tmpContext.translate(tmpX, tmpY);
                tmpContext.rotate(obj.dir);
                tmpContext.strokeStyle = outlineColor;
                tmpContext.lineWidth = outlineWidth;
                if (obj.name == "apple") {
                    tmpContext.fillStyle = "#c15555";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fillStyle = "#89a54c";
                    let leafDir = -(Math.PI / 2);
                    renderLeaf(obj.scale * Math.cos(leafDir), obj.scale * Math.sin(leafDir),
                               25, leafDir + Math.PI / 2, tmpContext);
                } else if (obj.name == "cookie") {
                    tmpContext.fillStyle = "#cca861";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fillStyle = "#937c4b";
                    let chips = 4;
                    let rotVal = (Math.PI * 2) / chips;
                    let tmpRange;
                    for (let i = 0; i < chips; ++i) {
                        tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                        renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                     UTILS.randInt(4, 5), tmpContext, true);
                    }
                } else if (obj.name == "cheese") {
                    tmpContext.fillStyle = "#f4f3ac";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fillStyle = "#c3c28b";
                    let chips = 4;
                    let rotVal = (Math.PI * 2) / chips;
                    let tmpRange;
                    for (let i = 0; i < chips; ++i) {
                        tmpRange = UTILS.randInt(obj.scale / 2.5, obj.scale / 1.7);
                        renderCircle(tmpRange * Math.cos(rotVal * i), tmpRange * Math.sin(rotVal * i),
                                     UTILS.randInt(4, 5), tmpContext, true);
                    }
                } else if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
                    tmpContext.fillStyle = (obj.name == "castle wall") ? "#83898e" : (obj.name == "wood wall") ?
                        "#a5974c" : "#939393";
                    let sides = (obj.name == "castle wall") ? 4 : 3;
                    renderStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = (obj.name == "castle wall") ? "#9da4aa" : (obj.name == "wood wall") ?
                        "#c9b758" : "#bcbcbc";
                    renderStar(tmpContext, sides, obj.scale * 0.65, obj.scale * 0.65);
                    tmpContext.fill();
                } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" ||
                           obj.name == "spinning spikes") {
                    tmpContext.fillStyle = (obj.name == "poison spikes") ? "#7b935d" : "#939393";
                    let tmpScale = (obj.scale * 0.6);
                    renderStar(tmpContext, (obj.name == "spikes") ? 5 : 6, obj.scale, tmpScale);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, tmpScale, tmpContext);
                    tmpContext.fillStyle = "#c9b758";
                    renderCircle(0, 0, tmpScale / 2, tmpContext, true);
                } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, reScale, tmpContext);
                    tmpContext.fillStyle = "#c9b758";
                    renderRectCircle(0, 0, reScale * 1.5, 29, 4, tmpContext);
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, reScale * 0.5, tmpContext);
                } else if (obj.name == "mine") {
                    tmpContext.fillStyle = "#939393";
                    renderStar(tmpContext, 3, obj.scale, obj.scale);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#bcbcbc";
                    renderStar(tmpContext, 3, obj.scale * 0.55, obj.scale * 0.65);
                    tmpContext.fill();
                } else if (obj.name == "sapling") {
                    for (let i = 0; i < 2; ++i) {
                        let tmpScale = obj.scale * (!i ? 1 : 0.5);
                        renderStar(tmpContext, 7, tmpScale, tmpScale * 0.7);
                        tmpContext.fillStyle = (!i ? "#9ebf57" : "#b4db62");
                        tmpContext.fill();
                        if (!i) tmpContext.stroke();
                    }
                } else if (obj.name == "pit trap") {
                    tmpContext.fillStyle = "#a5974c";
                    renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = outlineColor;
                    renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
                    tmpContext.fill();
                } else if (obj.name == "boost pad") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#dbd97d";
                    renderTriangle(obj.scale * 1, tmpContext);
                } else if (obj.name == "turret") {
                    tmpContext.fillStyle = "#a5974c";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#939393";
                    let tmpLen = 50;
                    renderRect(0, -tmpLen / 2, obj.scale * 0.9, tmpLen, tmpContext);
                    renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                } else if (obj.name == "platform") {
                    tmpContext.fillStyle = "#cebd5f";
                    let tmpCount = 4;
                    let tmpS = obj.scale * 2;
                    let tmpW = tmpS / tmpCount;
                    let tmpX = -(obj.scale / 2);
                    for (let i = 0; i < tmpCount; ++i) {
                        renderRect(tmpX - (tmpW / 2), 0, tmpW, obj.scale * 2, tmpContext);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpX += tmpS / tmpCount;
                    }
                } else if (obj.name == "healing pad") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#db6e6e";
                    renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                } else if (obj.name == "spawn pad") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.fillStyle = "#71aad6";
                    renderCircle(0, 0, obj.scale * 0.6, tmpContext);
                } else if (obj.name == "blocker") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.rotate(Math.PI / 4);
                    tmpContext.fillStyle = "#db6e6e";
                    renderRectCircle(0, 0, obj.scale * 0.65, 20, 4, tmpContext, true);
                } else if (obj.name == "teleporter") {
                    tmpContext.fillStyle = "#7e7f82";
                    renderCircle(0, 0, obj.scale, tmpContext);
                    tmpContext.fill();
                    tmpContext.stroke();
                    tmpContext.rotate(Math.PI / 4);
                    tmpContext.fillStyle = "#d76edb";
                    renderCircle(0, 0, obj.scale * 0.5, tmpContext, true);
                }
                tmpContext.restore();
            }
            let objSprites = [];
            function getObjSprite(obj) {
                let tmpSprite = objSprites[obj.id];
                if (!tmpSprite) {
                    let blurScale = 0;
                    let tmpCanvas = document.createElement("canvas");
                    tmpCanvas.width = tmpCanvas.height = obj.scale * 2.5 + outlineWidth + (items.list[obj.id].spritePadding || 0) + blurScale;
                    let tmpContext = tmpCanvas.getContext("2d");
                    tmpContext.translate(tmpCanvas.width / 2, tmpCanvas.height / 2);
                    tmpContext.rotate(Math.PI / 2);
                    tmpContext.strokeStyle = outlineColor;
                    tmpContext.lineWidth = outlineWidth;
                    if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
                        tmpContext.fillStyle = obj.name == "poison spikes" ? "#7b935d" : "#939393";
                        let tmpScale = obj.scale * 0.6;
                        renderStar(tmpContext, obj.name == "spikes" ? 5 : 6, obj.scale, tmpScale);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#a5974c";
                        renderCircle(0, 0, tmpScale, tmpContext);
                        tmpContext.fillStyle = "#cc5151";
                        renderCircle(0, 0, tmpScale / 2, tmpContext, true);
                    } else if (obj.name == "pit trap") {
                        tmpContext.fillStyle = "#a5974c";
                        renderStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                        tmpContext.fill();
                        tmpContext.stroke();
                        tmpContext.fillStyle = "#cc5151";
                        renderStar(tmpContext, 3, obj.scale * 0.65, obj.scale * 0.65);
                        tmpContext.fill();
                    }
                    tmpSprite = tmpCanvas;
                    objSprites[obj.id] = tmpSprite;
                }
                return tmpSprite;
            }
            function getMarkSprite(obj, tmpContext, tmpX, tmpY) {
                tmpContext.lineWidth = outlineWidth;
                tmpContext.globalAlpha = 1;
                tmpContext.strokeStyle = outlineColor;
                tmpContext.save();
                tmpContext.translate(tmpX, tmpY);
                tmpContext.rotate(obj.dir);
                if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
                    let sides = obj.name == "castle wall" ? 4 : 3;
                    renderHealthStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.stroke();
                } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
                    let tmpScale = obj.scale * 0.6;
                    renderHealthStar(tmpContext, obj.name == "spikes" ? 5 : 6, obj.scale, tmpScale);
                    tmpContext.stroke();
                } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                } else if (obj.name == "mine") {
                    renderHealthStar(tmpContext, 3, obj.scale, obj.scale);
                    tmpContext.stroke();
                } else if (obj.name == "sapling") {
                    let tmpScale = obj.scale * 0.7;
                    renderHealthStar(tmpContext, 7, obj.scale, tmpScale);
                    tmpContext.stroke();
                } else if (obj.name == "pit trap") {
                    renderHealthStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.stroke();
                } else if (obj.name == "boost pad") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "turret") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                } else if (obj.name == "platform") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "healing pad") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "spawn pad") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "blocker") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                } else if (obj.name == "teleporter") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                }
                tmpContext.restore();
            }
            function isOnScreen(x, y, s) {
                return (x + s >= 0 && x - s <= maxScreenWidth && y + s >= 0 && (y,
                                                                                s,
                                                                                maxScreenHeight));
            }
            function markObject22(tmpObj, tmpX, tmpY) {
                yen(tmpObj, mainContext, tmpX, tmpY);
            }
            function markObject(tmpObj, tmpX, tmpY) {
                getMarkSprite(tmpObj, mainContext, tmpX, tmpY);
            }
            function yen(obj, tmpContext, tmpX, tmpY) {
                tmpContext.lineWidth = outlineWidthRender;
                tmpContext.globalAlpha = 1;
                tmpContext.strokeStyle = outlineColorRender;
                tmpContext.save();
                tmpContext.translate(tmpX, tmpY);
                tmpContext.rotate(obj.dir);
                if (obj.name == "wood wall" || obj.name == "stone wall" || obj.name == "castle wall") {
                    let sides = obj.name == "castle wall" ? 4 : 3;
                    renderHealthStar(tmpContext, sides, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.stroke();
                } else if (obj.name == "spikes" || obj.name == "greater spikes" || obj.name == "poison spikes" || obj.name == "spinning spikes") {
                    let tmpScale = obj.scale * 0.6;
                    renderHealthStar(tmpContext, obj.name == "spikes" ? 5 : 6, obj.scale, tmpScale);
                    tmpContext.stroke();
                } else if (obj.name == "windmill" || obj.name == "faster windmill" || obj.name == "power mill") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                } else if (obj.name == "mine") {
                    renderHealthStar(tmpContext, 3, obj.scale, obj.scale);
                    tmpContext.stroke();
                } else if (obj.name == "sapling") {
                    let tmpScale = obj.scale * 0.7;
                    renderHealthStar(tmpContext, 7, obj.scale, tmpScale);
                    tmpContext.stroke();
                } else if (obj.name == "pit trap") {
                    renderHealthStar(tmpContext, 3, obj.scale * 1.1, obj.scale * 1.1);
                    tmpContext.stroke();
                } else if (obj.name == "boost pad") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "turret") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                } else if (obj.name == "platform") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "healing pad") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "spawn pad") {
                    renderHealthRect(0, 0, obj.scale * 2, obj.scale * 2, tmpContext, false, true);
                } else if (obj.name == "blocker") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                } else if (obj.name == "teleporter") {
                    renderHealthCircle(0, 0, obj.scale, tmpContext, false, true);
                }
                tmpContext.restore();
            }
            class MapPing {
                constructor(color, scale) {
                    this.init = function(x, y) {
                        this.scale = 0;
                        this.x = x;
                        this.y = y;
                        this.active = true;
                    };
                    this.update = function(ctxt, delta) {
                        if (this.active) {
                            this.scale += 0.05 * delta;
                            if (this.scale >= scale) {
                                this.active = false;
                            } else {
                                ctxt.globalAlpha = (1 - Math.max(0, this.scale / scale));
                                ctxt.beginPath();
                                ctxt.arc((this.x / config.mapScale) * mapDisplay.width, (this.y / config.mapScale)
                                         * mapDisplay.width, this.scale, 0, 2 * Math.PI);
                                ctxt.stroke();
                            }
                        }
                    };
                    this.color = color;
                }
            }
            function pingMap(x, y) {
                tmpPing = mapPings.find(pings => !pings.active);
                if (!tmpPing) {
                    tmpPing = new MapPing("#fff", config.mapPingScale);
                    mapPings.push(tmpPing);
                }
                tmpPing.init(x, y);
            }
            function updateMapMarker() {
                mapMarker.x = player.x;
                mapMarker.y = player.y;
            }
            let Pt = [];
            window.isAlly = function(id){
                for(let i = 0;i < Pt.length;i+=2){
                    if(id == Pt[i]){
                        return true;
                    }
                }
            }
            function renderMinimap(delta) {
                if (player && player.alive) {
                    mapContext.clearRect(0, 0, mapDisplay.width, mapDisplay.height);
                    mapContext.lineWidth = 4;
                    for (let i = 0; i < mapPings.length; ++i) {
                        tmpPing = mapPings[i];
                        mapContext.strokeStyle = tmpPing.color;
                        tmpPing.update(mapContext, delta);
                    }
                    mapContext.globalAlpha = 1;
                    mapContext.fillStyle = "#ff0000";
                    if (breakTrackers.length) {
                        mapContext.fillStyle = "#abcdef";
                        mapContext.font = "34px Hammersmith One";
                        mapContext.textBaseline = "middle";
                        mapContext.textAlign = "center";
                        for (let i = 0; i < breakTrackers.length;) {
                            mapContext.fillText("!", (breakTrackers[i].x / config.mapScale) * mapDisplay.width,
                                                (breakTrackers[i].y / config.mapScale) * mapDisplay.height);
                            i += 2;
                        }
                    }
                    mapContext.globalAlpha = 1;
                    mapContext.fillStyle = "#fff";
                    renderCircle((player.x / config.mapScale) * mapDisplay.width,
                                 (player.y / config.mapScale) * mapDisplay.height, 7, mapContext, true);
                    mapContext.fillStyle = "rgba(255,255,255,0.35)";
                    if (player.team && minimapData) {
                        for (let i = 0; i < minimapData.length;) {
                            renderCircle((minimapData[i] / config.mapScale) * mapDisplay.width,
                                         (minimapData[i + 1] / config.mapScale) * mapDisplay.height, 7, mapContext, true);
                            i += 2;
                        }
                    }
                    if (lastDeath) {
                        mapContext.fillStyle = "#fc5553";
                        mapContext.font = "34px Hammersmith One";
                        mapContext.textBaseline = "middle";
                        mapContext.textAlign = "center";
                        mapContext.fillText("x", (lastDeath.x / config.mapScale) * mapDisplay.width,
                                            (lastDeath.y / config.mapScale) * mapDisplay.height);
                    }
                    if (mapMarker) {
                        mapContext.fillStyle = "#fff";
                        mapContext.font = "34px Hammersmith One";
                        mapContext.textBaseline = "middle";
                        mapContext.textAlign = "center";
                        mapContext.fillText("x", (mapMarker.x / config.mapScale) * mapDisplay.width,
                                            (mapMarker.y / config.mapScale) * mapDisplay.height);
                    }
                }
            }
            let crossHairs = [
                "https://cdn.discordapp.com/attachments/1001384433078779927/1149285738412769300/newawwddd.png",
                "https://cdn.discordapp.com/attachments/1001384433078779927/1149285168780165170/100px-Crosshairs_Red.png"
            ];
            let crossHairSprites = {};
            let iconSprites = {
                crown: new Image(),
                skull: new Image()
            };
            function loadIcons() {
                iconSprites.crown.onload = function() {
                    this.isLoaded = true;
                };
                iconSprites.crown.src = "./../img/icons/crown.png";
                iconSprites.skull.onload = function() {
                    this.isLoaded = true;
                };
                iconSprites.skull.src = "./../img/icons/skull.png";
                for (let i = 0; i < crossHairs.length; ++i) {
                    let tmpSprite = new Image();
                    tmpSprite.onload = function() {
                        this.isLoaded = true;
                    };
                    tmpSprite.src = crossHairs[i];
                    crossHairSprites[i] = tmpSprite;
                }
            }
            loadIcons();
            function updateGame() {

                if (config.resetRender) {
                    mainContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
                    mainContext.beginPath();
                }
                if (true) {
                    if (player) {
                        if (false) {
                            camX = player.x;
                            camY = player.y;
                        } else {
                            let tmpDist = UTILS.getDistance(camX, camY, player.x, player.y);
                            let tmpDir = UTILS.getDirection(player.x, player.y, camX, camY);
                            let camSpd = Math.min(tmpDist * 0.01 * delta, tmpDist);
                            if (tmpDist > 0.05) {
                                camX += camSpd * Math.cos(tmpDir);
                                camY += camSpd * Math.sin(tmpDir);
                            } else {
                                camX = player.x;
                                camY = player.y;
                            }
                        }
                    } else {
                        camX = config.mapScale / 2;
                        camY = config.mapScale / 2;
                    }
                    let lastTime = now - (1000 / config.serverUpdateRate);
                    let tmpDiff;
                    for (let i = 0; i < players.length + ais.length; ++i) {
                        tmpObj = players[i] || ais[i - players.length];
                        if (tmpObj && tmpObj.visible) {
                            if (tmpObj.forcePos) {
                                tmpObj.x = tmpObj.x2;
                                tmpObj.y = tmpObj.y2;
                                tmpObj.dir = tmpObj.d2;
                            } else {
                                let total = tmpObj.t2 - tmpObj.t1;
                                let fraction = lastTime - tmpObj.t1;
                                let ratio = (fraction / total);
                                let rate = 170;
                                tmpObj.dt += delta;
                                let tmpRate = Math.min(1.7, tmpObj.dt / rate);
                                tmpDiff = (tmpObj.x2 - tmpObj.x1);
                                tmpObj.x = tmpObj.x1 + (tmpDiff * tmpRate);
                                tmpDiff = (tmpObj.y2 - tmpObj.y1);
                                tmpObj.y = tmpObj.y1 + (tmpDiff * tmpRate);
                                if (config.anotherVisual) {
                                    tmpObj.dir = Math.lerpAngle(tmpObj.d2, tmpObj.d1, Math.min(1.2, ratio));
                                } else {
                                    tmpObj.dir = Math.lerpAngle(tmpObj.d2, tmpObj.d1, Math.min(1.2, ratio));
                                }
                            }
                        }
                    }
                    let xOffset = camX - (maxScreenWidth / 2);
                    let yOffset = camY - (maxScreenHeight / 2);
                    //render
                    if (config.snowBiomeTop - yOffset <= 0 && config.mapScale - config.snowBiomeTop - yOffset >= maxScreenHeight) {
                        mainContext.fillStyle = "#b6db66";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (config.mapScale - config.snowBiomeTop - yOffset <= 0) {
                        mainContext.fillStyle = "#dbc666";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (config.snowBiomeTop - yOffset >= maxScreenHeight) {
                        mainContext.fillStyle = "#fff";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if (config.snowBiomeTop - yOffset >= 0) {
                        mainContext.fillStyle = "#fff";
                        mainContext.fillRect(0, 0, maxScreenWidth, config.snowBiomeTop - yOffset);
                        mainContext.fillStyle = "#b6db66";
                        mainContext.fillRect(0, config.snowBiomeTop - yOffset, maxScreenWidth,
                                             maxScreenHeight - (config.snowBiomeTop - yOffset));
                    } else {
                        mainContext.fillStyle = "#b6db66";
                        mainContext.fillRect(0, 0, maxScreenWidth,
                                             (config.mapScale - config.snowBiomeTop - yOffset));
                        mainContext.fillStyle = "#dbc666";
                        mainContext.fillRect(0, (config.mapScale - config.snowBiomeTop - yOffset), maxScreenWidth,
                                             maxScreenHeight - (config.mapScale - config.snowBiomeTop - yOffset));
                    }
                    if (!firstSetup) {
                        waterMult += waterPlus * config.waveSpeed * delta;
                        if (waterMult >= config.waveMax) {
                            waterMult = config.waveMax;
                            waterPlus = -1;
                        } else if (waterMult <= 1) {
                            waterMult = waterPlus = 1;
                        }
                        mainContext.globalAlpha = 1;
                        mainContext.fillStyle = "#dbc666";
                        renderWaterBodies(xOffset, yOffset, mainContext, config.riverPadding);
                        mainContext.fillStyle = "#91b2db";
                        renderWaterBodies(xOffset, yOffset, mainContext, (waterMult - 1) * 250);
                    }
                    if(configs5.Grid) {
                        mainContext.lineWidth = 4; //Visuals
                        mainContext.strokeStyle = "#000";
                        mainContext.globalAlpha = 0.06;
                    } else {
                        mainContext.lineWidth = 0; //Visuals
                        mainContext.strokeStyle = "#000";
                        mainContext.globalAlpha = 0;
                    }
                    for (let x = -camX; x < maxScreenWidth; x += maxScreenHeight / 18) {
                        if (x > 0) {
                            mainContext.moveTo(x, 0);
                            mainContext.lineTo(x, maxScreenHeight);
                        }
                    }
                    for (let y = -camY; y < maxScreenHeight; y += maxScreenHeight / 18) {
                        if (y > 0) {
                            mainContext.moveTo(0, y);
                            mainContext.lineTo(maxScreenWidth, y);
                        }
                    }
                    mainContext.stroke();
                    if (player) {
                        if (lastDeath) {
                            mainContext.globalAlpha = 1;
                            mainContext.fillStyle = "#fc5553";
                            mainContext.font = "100px Hammersmith One";
                            mainContext.textBaseline = "middle";
                            mainContext.textAlign = "center";
                            mainContext.fillText("O", lastDeath.x - xOffset, lastDeath.y - yOffset);
                        }
                    }
                    mainContext.globalAlpha = 1;
                    mainContext.strokeStyle = outlineColor;
                    renderDeadPlayers(xOffset, yOffset);
                    mainContext.globalAlpha = 1;
                    mainContext.strokeStyle = outlineColor;
                    renderGameObjects(-1, xOffset, yOffset);
                    mainContext.globalAlpha = 1;
                    mainContext.lineWidth = outlineWidth;
                    renderProjectiles(0, xOffset, yOffset);
                    renderPlayers(xOffset, yOffset, 0);
                    mainContext.globalAlpha = 1;
                    for (let i = 0; i < ais.length; ++i) {
                        tmpObj = ais[i];
                        if (tmpObj.active && tmpObj.visible) {
                            tmpObj.animate(delta);
                            mainContext.save();
                            mainContext.translate(tmpObj.x - xOffset, tmpObj.y - yOffset);
                            mainContext.rotate(tmpObj.dir + tmpObj.dirPlus - (Math.PI / 2));
                            renderAI(tmpObj, mainContext);
                            mainContext.restore();
                        }
                    }
                    renderGameObjects(0, xOffset, yOffset);
                    renderProjectiles(1, xOffset, yOffset);
                    renderGameObjects(1, xOffset, yOffset);
                    renderPlayers(xOffset, yOffset, 1);
                    renderGameObjects(2, xOffset, yOffset);
                    renderGameObjects(3, xOffset, yOffset);
                    mainContext.fillStyle = "#000";
                    mainContext.globalAlpha = 0.2;
                    if (xOffset <= 0) {
                        mainContext.fillRect(0, 0, -xOffset, maxScreenHeight);
                    } if (config.mapScale - xOffset <= maxScreenWidth) {
                        let tmpY = Math.max(0, -yOffset);
                        mainContext.fillRect(config.mapScale - xOffset, tmpY, maxScreenWidth - (config.mapScale - xOffset), maxScreenHeight - tmpY);
                    } if (yOffset <= 0) {
                        mainContext.fillRect(-xOffset, 0, maxScreenWidth + xOffset, -yOffset);
                    } if (config.mapScale - yOffset <= maxScreenHeight) {
                        let tmpX = Math.max(0, -xOffset);
                        let tmpMin = 0;
                        if (config.mapScale - xOffset <= maxScreenWidth)
                            tmpMin = maxScreenWidth - (config.mapScale - xOffset);
                        mainContext.fillRect(tmpX, config.mapScale - yOffset,
                                             (maxScreenWidth - tmpX) - tmpMin, maxScreenHeight - (config.mapScale - yOffset));
                    }
                    mainContext.globalAlpha = 1;
                    if(getEl("timeType").value == "eveningt") {
                        mainContext.fillStyle = "rgba(0, 0, 70, 0.50)";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if(getEl("timeType").value == "nightt") {
                        mainContext.fillStyle = "rgba(0, 0, 70, 0.60)";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if(getEl("timeType").value == "morningt") {
                        mainContext.fillStyle = "rgba(0, 0, 70, 0.30)";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if(getEl("timeType").value == "afternoont") {
                        mainContext.fillStyle = "rgba(0, 0, 70, 0.40)";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if(getEl("visualType").value == "aevisuals") {
                        mainContext.fillStyle = "rgba(0, 0, 70, 0.35)";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else if(getEl("visualType").value == "fz") {
                        mainContext.fillStyle = "rgba(0, 0, 70, 0.35)";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    } else {
                        mainContext.fillStyle = "rgba(20, 0, 70, 0.45)";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                        mainContext.fillStyle = "rgba(0, 5, 0, 0.15)";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                        mainContext.fillStyle = "rgba(255, 255, 255, 0.025)";
                        mainContext.fillRect(0, 0, maxScreenWidth, maxScreenHeight);
                    }
                    mainContext.strokeStyle = darkOutlineColor;
                    mainContext.globalAlpha = 1;
                    let shame = true;
                    for (let i = 0; i < players.length + ais.length; ++i) {
                        tmpObj = players[i] || ais[i - players.length];
                        if (tmpObj.visible) {
                            mainContext.strokeStyle = darkOutlineColor;
                            if (tmpObj.skinIndex != 10 || (tmpObj == player) || (tmpObj.team && tmpObj.team == player.team)) {
                                let tmpText = "";
                                if(configs5.Shame) {
                                    shame = true;
                                }else {
                                    shame = false;
                                }
                                if(getEl("visualType").value == "aevisuals") {
                                    tmpText = (tmpObj.team ? "[" + tmpObj.team + "] " : "") + tmpObj.name;
                                }
                                if (getEl("visualType").value == "fz") {
                                    tmpText = (tmpObj.team ? "[" + tmpObj.team + "] " : "") + ("[" + tmpObj.primaryIndex + "/" + tmpObj.secondaryIndex + "/" + tmpObj.maxShameCount + "] ") + tmpObj.name;
                                }
                                if (tmpText != "") {
                                    if(tmpObj.isPlayer) {
                                        mainContext.font = (tmpObj.nameScale||30) + "px Hammersmith One";
                                        mainContext.fillStyle = "#fff";
                                        mainContext.textBaseline = "middle";
                                        mainContext.textAlign = "center";
                                        mainContext.lineWidth = (tmpObj.nameScale?11:8);
                                        mainContext.lineJoin = "round";
                                        mainContext.strokeText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY);
                                        mainContext.fillText(tmpText, tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) - config.nameY);
                                    }
                                    if (tmpObj.isLeader && iconSprites["crown"].isLoaded) {
                                        var tmpS = config.crownIconScale;
                                        var tmpX = tmpObj.x - xOffset - (tmpS/2) - (mainContext.measureText(tmpText).width / 2) - config.crownPad;
                                        mainContext.drawImage(iconSprites["crown"], tmpX, (tmpObj.y - yOffset - tmpObj.scale)
                                                              - config.nameY - (tmpS/2) - 5, tmpS, tmpS);
                                    } if (tmpObj.iconIndex == 1 && iconSprites["skull"].isLoaded) {
                                        var tmpS = config.crownIconScale;
                                        var tmpX = tmpObj.x - xOffset - (tmpS/2) + (mainContext.measureText(tmpText).width / 2) + config.crownPad;
                                        mainContext.drawImage(iconSprites["skull"], tmpX, (tmpObj.y - yOffset - tmpObj.scale)
                                                              - config.nameY - (tmpS/2) - 5, tmpS, tmpS);
                                    }
                                    if (tmpObj.isPlayer && crossHair && near == tmpObj && (crossHair ? crossHairSprites[1].isLoaded : crossHairSprites[0].isLoaded) && enemy.length) {
                                        let tmpS = tmpObj.scale * 2.2;
                                        mainContext.drawImage((crossHair ? crossHairSprites[1] : crossHairSprites[0]), tmpObj.x - xOffset - tmpS / 2, tmpObj.y - yOffset - tmpS / 2, tmpS, tmpS);
                                    }
                                    if(tmpObj.isPlayer && shame) {
                                        //    mainContext.font = (tmpObj.nameScale || 30) + "px Hammersmith One";
                                        var textColor;
                                        mainContext.font = (tmpObj.nameScale || 30) + "px Hammersmith One";
                                        mainContext.fillStyle = 'red';
                                        mainContext.strokeStyle = 'black';
                                        mainContext.textBaseline = "middle";
                                        mainContext.textAlign = "center";
                                        mainContext.lineWidth = tmpObj.nameScale ? 11 : 8;
                                        mainContext.lineJoin = "round";
                                        var tmpS = config.crownIconScale;
                                        var tmpX = tmpObj.x - xOffset - (tmpS/2) + (mainContext.measureText(tmpText).width / 2) + config.crownPad + 15;
                                        mainContext.strokeText(tmpObj.shameCount, tmpX, tmpObj.y - yOffset - tmpObj.scale - config.nameY);
                                        mainContext.fillText(tmpObj.shameCount, tmpX, tmpObj.y - yOffset - tmpObj.scale - config.nameY);
                                    }

                                    tmpText = "";
                                }
                                if (tmpObj.isPlayer) {
                                    mainContext.lineCap = "round";
                                    mainContext.strokeStyle = "#581845";
                                    mainContext.lineWidth = 8
                                    mainContext.beginPath();
                                    mainContext.moveTo(0, 0);
                                    mainContext.lineTo(0, - tmpObj.scale);
                                    mainContext.lineTo(- tmpObj.scale, - tmpObj.scale);
                                    mainContext.stroke();
                                    mainContext.strokeStyle = "transparent";
                                }
                                if ((tmpObj !== player || tmpObj.team !== player.team) && tmpObj.isPlayer && configs6.Tracers) {
                                    let center = {
                                        x: screenWidth / 2,
                                        y: screenHeight / 2,
                                    };
                                    let alpha = Math.min(1, (UTILS.getDistance(0, 0, player.x - tmpObj.x, (player.y - tmpObj.y) * (16 / 9)) * 100) / (config.maxScreenHeight / 2) / center.y);
                                    let dist = center.y * alpha;
                                    let tmpX = dist * Math.cos(UTILS.getDirect(tmpObj, player, 0, 0));
                                    let tmpY = dist * Math.sin(UTILS.getDirect(tmpObj, player, 0, 0));
                                    mainContext.save();
                                    mainContext.translate((player.x - xOffset) + tmpX, (player.y - yOffset) + tmpY);
                                    mainContext.rotate(tmpObj.aim2 + Math.PI / 2);
                                    let by = 255 - (tmpObj.sid * 2);
                                    mainContext.fillStyle = tmpObj === player || (tmpObj.team && tmpObj.team === player.team) ? "rgba(142, 204, 81, 1)" : `rgb(${by}, ${by}, ${by})`;
                                    mainContext.globalAlpha = alpha;
                                    let renderTracer = function(s, ctx) {
                                        ctx = ctx || mainContext;
                                        let h = s * (Math.sqrt(3) / 2);
                                        ctx.beginPath();
                                        ctx.moveTo(0, -h / 1.5);
                                        ctx.lineTo(-s / 2, h / 2);
                                        ctx.lineTo(s / 2, h / 2);
                                        ctx.lineTo(0, -h / 1.5);
                                        ctx.fill();
                                        ctx.closePath();
                                    }
                                    renderTracer(25, mainContext);
                                    mainContext.restore();
                                }
                                let render = {
                                    x: tmpObj.x2 - xOffset,
                                    y: tmpObj.y2 - yOffset
                                };
                                if (tmpObj.health) {
                                    mainContext.globalAlpha = 1;
                                    mainContext.font = "20px Hammersmith One";
                                    mainContext.fillStyle = "#fff";
                                    mainContext.strokeStyle = darkOutlineColor;
                                    mainContext.textBaseline = "middle";
                                    mainContext.textAlign = "center";
                                    mainContext.lineWidth = 8;
                                    mainContext.lineJoin = "round";
                                    if(getEl("visualType").value == "fz" && tmpObj.isPlayer) {
                                        // HEALTH HOLDER:
                                        var tmpWidth = config.healthBarWidth;
                                        mainContext.fillStyle = darkOutlineColor;
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY, (config.healthBarWidth * 2) +
                                                              (config.healthBarPad * 2), 17, 11); // 11
                                        mainContext.fill();
                                        // HEALTH BAR:
                                        mainContext.fillStyle = (tmpObj==player||(tmpObj.team&&tmpObj.team==player.team))? "#8ecc51" : "#cc5151";
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + config.healthBarPad,
                                                              ((config.healthBarWidth * 2) * (tmpObj.health / tmpObj.maxHealth)), 17 - config.healthBarPad * 2, 20);
                                        mainContext.fill();
                                        mainContext.fillStyle = "#fff";

                                        let reloads = {
                                            primary: (tmpObj.primaryIndex == undefined ? 1 : ((items.weapons[tmpObj.primaryIndex].speed - tmpObj.reloads[tmpObj.primaryIndex]) / items.weapons[tmpObj.primaryIndex].speed)),
                                            secondary: (tmpObj.secondaryIndex == undefined ? 1 : ((items.weapons[tmpObj.secondaryIndex].speed - tmpObj.reloads[tmpObj.secondaryIndex]) / items.weapons[tmpObj.secondaryIndex].speed)),
                                            //   turret: (2500 - tmpObj.reloads[53]) / 2500
                                        };

                                        // SECONDARY RELOAD HOLDER:
                                        mainContext.fillStyle = darkOutlineColor;
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarPad + 5,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13, (config.healthBarWidth-5) +
                                                              (config.healthBarPad * 2), 17, 8);
                                        mainContext.fill();

                                        // SECONDARY RELOAD BAR:
                                        mainContext.fillStyle = reloads.secondary == 1 ? "#FFFFFF" : "hsl(" + 50 * reloads.secondary + ", 50%, 60%)";
                                        mainContext.roundRect(tmpObj.x - xOffset + 5,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13 + config.healthBarPad,
                                                              (config.healthBarWidth * reloads.secondary + 1) - 5, 17 - config.healthBarPad * 2, 7);
                                        mainContext.fill();

                                        // PRIMARY RELOAD HOLDER:
                                        mainContext.fillStyle = darkOutlineColor;
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13, config.healthBarWidth +
                                                              (config.healthBarPad * 2) - 5, 17, 8);
                                        mainContext.fill();

                                        // PRIMARY RELOAD BAR:
                                        mainContext.fillStyle = reloads.primary == 1 ? "#FFF533" : "hsl(" + 50 * reloads.primary + ", 50%, 60%)";
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13 + config.healthBarPad,
                                                              (config.healthBarWidth * reloads.primary + 1) - 5, 17 - config.healthBarPad * 2, 7);
                                        mainContext.fill();
                                        if(tmpObj === player) {
                                            mainContext.fillStyle = "#fff";
                                            mainContext.strokeText("[" + instaC.isTrue + "/" + my.antiSync + "/" + ms.max + "," + window.pingTime + "," + ms.avg + "]", tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) + 135);
                                            mainContext.fillText("[" + instaC.isTrue + "/" + my.antiSync + "/" + ms.max + "," + window.pingTime + "," + ms.avg + "]", tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) + 135);
                                        }
                                    } else if((configs5.Visuals || configs5.Reloads) && tmpObj.isPlayer) {
                                        if(configs5.Reloads) {
                                            // HEALTH HOLDER:
                                            var tmpWidth = config.healthBarWidth;
                                            mainContext.fillStyle = darkOutlineColor;
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                                  (tmpObj.y - yOffset + tmpObj.scale) + config.nameY, (config.healthBarWidth * 2) +
                                                                  (config.healthBarPad * 2), 17, 11); // 11
                                            mainContext.fill();
                                            // HEALTH BAR:
                                            mainContext.fillStyle = (tmpObj==player||(tmpObj.team&&tmpObj.team==player.team))? "#8ecc51" : "#cc5151";
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                                  (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + config.healthBarPad,
                                                                  ((config.healthBarWidth * 2) * (tmpObj.health / tmpObj.maxHealth)), 17 - config.healthBarPad * 2, 20);
                                            mainContext.fill();
                                            mainContext.fillStyle = "#fff";

                                            let reloads = {
                                                primary: (tmpObj.primaryIndex == undefined ? 1 : ((items.weapons[tmpObj.primaryIndex].speed - tmpObj.reloads[tmpObj.primaryIndex]) / items.weapons[tmpObj.primaryIndex].speed)),
                                                secondary: (tmpObj.secondaryIndex == undefined ? 1 : ((items.weapons[tmpObj.secondaryIndex].speed - tmpObj.reloads[tmpObj.secondaryIndex]) / items.weapons[tmpObj.secondaryIndex].speed)),
                                                // turret: (2500 - tmpObj.reloads[53]) / 2500
                                                turret: (2500 - tmpObj.reloads[53]) / 2500
                                            };

                                            // SECONDARY RELOAD HOLDER:
                                            mainContext.fillStyle = darkOutlineColor;
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarPad + 5,
                                                                  (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13, (config.healthBarWidth-5) +
                                                                  (config.healthBarPad * 2), 17, 8);
                                            mainContext.fill();

                                            // SECONDARY RELOAD BAR:
                                            mainContext.fillStyle = reloads.secondary == 1 ? "#5DDAE5" : "#7AFFD1";
                                            mainContext.roundRect(tmpObj.x - xOffset + 5,
                                                                  (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13 + config.healthBarPad,
                                                                  (config.healthBarWidth * reloads.secondary + 1) - 5, 17 - config.healthBarPad * 2, 7);
                                            mainContext.fill();

                                            // PRIMARY RELOAD HOLDER:
                                            mainContext.fillStyle = darkOutlineColor;
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                                  (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13, config.healthBarWidth +
                                                                  (config.healthBarPad * 2) - 5, 17, 8);
                                            mainContext.fill();

                                            // PRIMARY RELOAD BAR:
                                            mainContext.fillStyle = reloads.primary == 1 ? "#5DDAE5" : "#7AFFD1";
                                            mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                                  (tmpObj.y - yOffset + tmpObj.scale) + config.nameY - 13 + config.healthBarPad,
                                                                  (config.healthBarWidth * reloads.primary + 1) - 5, 17 - config.healthBarPad * 2, 7);
                                            mainContext.fill();
                                        }
                                        if(tmpObj === player && configs5.Visuals) {
                                            mainContext.fillStyle = "#fff";
                                            mainContext.strokeText("[" + instaC.isTrue + "/" + my.antiSync + "/" + turretR + "," + ms.max + "]", tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) + 135);
                                            mainContext.fillText("[" + instaC.isTrue + "/" + my.antiSync + "/" + turretR + "," + ms.max + "]", tmpObj.x - xOffset, (tmpObj.y - yOffset - tmpObj.scale) + 135);
                                        }
                                    } else if (getEl("visualType").value == "aevisuals") {
                                        var tmpWidth = config.healthBarWidth;
                                        mainContext.fillStyle = darkOutlineColor;
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth - config.healthBarPad,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY, (config.healthBarWidth * 2) +
                                                              (config.healthBarPad * 2), 17, 11);
                                        mainContext.fill();
                                        mainContext.fillStyle = (tmpObj==player||(tmpObj.team&&tmpObj.team==player.team))? "#8ecc51" : "#cc5151";
                                        mainContext.roundRect(tmpObj.x - xOffset - config.healthBarWidth,
                                                              (tmpObj.y - yOffset + tmpObj.scale) + config.nameY + config.healthBarPad,
                                                              ((config.healthBarWidth * 2) * (tmpObj.health / tmpObj.maxHealth)), 17 - config.healthBarPad * 2, 20);
                                        mainContext.fill();
                                        mainContext.fillStyle = "#fff";
                                    }
                                    else if (configs4.Rainbow) {
                                        gameObjects.forEach((tmp) => {
                                            let tmpObj = tmp;
                                            if (tmpObj.active && tmpObj.health > 0) {
                                                const healthRatio = tmpObj.health / tmpObj.maxHealth;

                                                if (tmpObj && getDist(tmpObj, player) <= 400) {
                                                    var tmpWidth = config.healthBarWidth;
                                                    mainContext.fillStyle = player.sid != tmpObj.owner.sid && !findAllianceBySid(tmpObj.owner.sid) ? "#C12D5F" : "#2187C0";
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        }
                    }
                    function renderGameObjects(layer, xOffset, yOffset) {
                        let tmpSprite;
                        let tmpX;
                        let tmpY;
                        gameObjects.forEach((tmp) => {
                            tmpObj = tmp;
                            if (tmpObj.alive) {
                                tmpX = tmpObj.x + tmpObj.xWiggle - xOffset;
                                tmpY = tmpObj.y + tmpObj.yWiggle - yOffset;
                                if (layer == 0) {
                                    tmpObj.update(delta);
                                }
                                mainContext.globalAlpha = tmpObj.alpha;
                                if (tmpObj.layer == layer && isOnScreen(tmpX, tmpY, tmpObj.scale + (tmpObj.blocker || 0))) {
                                    if (tmpObj.isItem) {
                                        if ((tmpObj.dmg || tmpObj.trap) && !tmpObj.isTeamObject(player)) {
                                            tmpSprite = getObjSprite(tmpObj);
                                        } else {
                                            tmpSprite = getItemSprite(tmpObj);
                                        }
                                        mainContext.save();
                                        mainContext.translate(tmpX, tmpY);
                                        mainContext.rotate(tmpObj.dir);
                                        if (!tmpObj.active) {
                                            mainContext.scale(tmpObj.visScale / tmpObj.scale, tmpObj.visScale / tmpObj.scale);
                                        }
                                        mainContext.drawImage(tmpSprite, -(tmpSprite.width / 2), -(tmpSprite.height / 2));
                                        if (tmpObj.blocker) {
                                            mainContext.strokeStyle = "#db6e6e";
                                            mainContext.globalAlpha = 0.3;
                                            mainContext.lineWidth = 6;
                                            renderCircle(0, 0, tmpObj.blocker, mainContext, false, true);
                                        }
                                        mainContext.restore();
                                    } else {
                                        tmpSprite = getResSprite(tmpObj);
                                        mainContext.drawImage(tmpSprite, tmpX - (tmpSprite.width / 2), tmpY - (tmpSprite.height / 2));
                                    }
                                }
                                document.minis = .1;
                                document.bigis = 2.95;
                                if (layer == 3 && configs4.ObjHp) {
                                    if (tmpObj.health < tmpObj.maxHealth) {
                                        const normalScale = tmpObj.scale / 2;
                                        const normalGap = normalScale * 2 * document.minis;
                                        const normalStart = normalScale / 1.5;
                                        const Filler = (2 * Math.PI) / (tmpObj.maxHealth / tmpObj.healthMov);
                                        mainContext.save();
                                        mainContext.beginPath();
                                        mainContext.lineCap = 'round';
                                        mainContext.arc(tmpX, tmpY, normalStart, 0, Filler);
                                        mainContext.lineWidth = normalGap * document.bigis;
                                        mainContext.strokeStyle = darkOutlineColor;
                                        mainContext.stroke();
                                        mainContext.beginPath();
                                        mainContext.lineCap = 'round';
                                        mainContext.arc(tmpX, tmpY, normalStart, 0, Filler);
                                        mainContext.lineWidth = 7;
                                        mainContext.strokeStyle = tmpObj.isTeamObject(player) ? myObjectHealth : enemyObjectHealth;
                                        mainContext.stroke();
                                        mainContext.closePath();
                                        mainContext.restore();

                                        mainContext.fillStyle = tmpObj.isTeamObject(player) ? "#fff" : "#F05C5B";
                                        mainContext.textBaseline = "middle";
                                        mainContext.textAlign = "center";
                                        mainContext.lineWidth = 0;
                                        mainContext.lineJoin = "round";

                                        mainContext.strokeStyle = darkOutlineColor;
                                        mainContext.lineWidth = 5;

                                        const fontSize = 18;
                                        mainContext.font = `${fontSize}px Hammersmith One`;

                                        mainContext.strokeText(tmpObj.owner.sid, tmpObj.x - xOffset, tmpObj.y - yOffset + 32.6);
                                        mainContext.fillText(tmpObj.owner.sid, tmpObj.x - xOffset, tmpObj.y - yOffset + 32.6);
                                    }
                                }
                            }
                        });


                        mainContext.restore();
                        if (layer == 0) {
                            if (placeVisible.length) {
                                placeVisible.forEach((places) => {
                                    tmpX = places.x - xOffset;
                                    tmpY = places.y - yOffset;
                                    markObject(places, tmpX, tmpY);
                                });
                            }
                        }
                    }
                    function drawArrow(xOffset, yOffset, x, y, arrowWidth, color, angle, lineWidth) {
                        mainContext.save()
                        mainContext.translate(x - xOffset, y - yOffset)
                        mainContext.rotate(Math.PI / 4)
                        mainContext.rotate(angle)
                        mainContext.globalAlpha = 1
                        mainContext.strokeStyle = color
                        mainContext.lineCap = "round"
                        mainContext.lineWidth = lineWidth
                        mainContext.beginPath()
                        mainContext.moveTo(-arrowWidth, -arrowWidth)
                        mainContext.lineTo(arrowWidth, -arrowWidth)
                        mainContext.lineTo(arrowWidth, arrowWidth)
                        mainContext.stroke()
                        mainContext.closePath()
                        mainContext.restore()
                    }
                    if (player) {
                        // AUTOPUSH LINE:
                        if (my.autoPush) {
                            mainContext.lineWidth = 5;
                            mainContext.globalAlpha = 1;
                            mainContext.beginPath();

                            mainContext.strokeStyle = autoPushLine;
                            mainContext.moveTo(player.x - xOffset, player.y - yOffset);
                            mainContext.lineTo(my.pushData.x2 - xOffset, my.pushData.y2 - yOffset);
                            mainContext.lineTo(my.pushData.x - xOffset, my.pushData.y - yOffset);
                            mainContext.stroke();
                        }
                    }
                    mainContext.globalAlpha = 1;
                    textManager.update(delta, mainContext, xOffset, yOffset);
                    for (var i = 0; i < players.length; ++i) {
                        tmpObj = players[i];
                        if (tmpObj.visible && tmpObj.chatCountdown > 0) {
                            tmpObj.chatCountdown -= delta;
                            if (tmpObj.chatCountdown <= 0)
                                tmpObj.chatCountdown = 0;
                            mainContext.font = "24px Hammersmith One";
                            var tmpSize = mainContext.measureText(tmpObj.chatMessage);
                            mainContext.textBaseline = "middle";
                            mainContext.textAlign = "center";
                            var tmpX = tmpObj.x - xOffset;
                            var tmpY = tmpObj.y - tmpObj.scale - yOffset - 90;
                            var tmpH = 47;
                            var tmpW = tmpSize.width + 17;
                            mainContext.fillStyle = "#FFFFFF";
                            setTimeout(() => {
                                mainContext.fillStyle = "#FFE000";
                            }, 100);
                            mainContext.roundRect(tmpX-tmpW/2, tmpY-tmpH/2, tmpW, tmpH, 6);
                            mainContext.fill();
                            mainContext.fillStyle = "#000000";
                            mainContext.fillText(tmpObj.chatMessage, tmpX, tmpY);
                        }
                    }
                }
                mainContext.globalAlpha = 1;
                renderMinimap(delta);
            }
            window.requestAnimFrame = function() {
                return null;
            }
            window.rAF = (function() {
                return window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    function(callback) {
                    window.setTimeout(callback, 1e999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999999);
                };
            })();

            let ms = {
                avg: 0,
                max: 0,
                min: 0,
                delay: 0
            }
            function doUpdate() {
                const now2 = new Date();
                const hours = now2.getHours();
                const minutes = now2.getMinutes();
                const secondsFor = now2.getSeconds();

                const ampm = hours >= 12 ? 'PM' : 'AM';
                const formattedHours = (hours % 12 || 12).toString();
                const formattedMinutes = minutes.toString().padStart(2, '0');
                let seconds = secondsFor < 10 ? "0" + secondsFor : secondsFor;
                let time = `${formattedHours}:${formattedMinutes}:${seconds} ${ampm}`;
                now = performance.now();
                delta = now - lastUpdate;
                lastUpdate = now;
                let timer = performance.now();
                let diff = timer - fpsTimer.last;
                if (diff >= 1000) {
                    fpsTimer.ltime = fpsTimer.time * (1000 / diff);
                    fpsTimer.last = timer;
                    fpsTimer.time = 0;
                }
                ms.avg = Math.round((ms.min+ms.max)/2);

                fpsTimer.time++;
                updateGame();
                rAF(doUpdate);
                getEl("fpstimer").innerHTML = `Frames: ${UTILS.round(fpsTimer.ltime, 10)}`;
                getEl("InfoAll").innerHTML = "PrePlace: " + PrePlaceCount;
                if(configs5.Info) {
                    getEl("Time").innerHTML = time;
                    getEl("Music").innerHTML = `Music: ` + musicV;
                    getEl("pingFps").innerHTML = `Ping: ${window.pingTime}ms`;
                    getEl("packetStatus").innerHTML = "Packet: " + secPacket;
                }else {
                    getEl("Time").innerHTML = ` `;
                    getEl("Music").innerHTML = ` `;
                    getEl("pingFps").innerHTML = `⠀`;
                    if(configs5.Packet) {
                        getEl("packetStatus").innerHTML = "Packet: " + secPacket;
                    } else {
                        getEl("packetStatus").innerHTML = "⠀";
                    }
                }
            }
            prepareMenuBackground();
            doUpdate();
            let changeDays = {};
            window.debug = function() {
                my.waitHit = 0;
                my.autoAim = false;
                instaC.isTrue = false;
                traps.inTrap = false;
                itemSprites = [];
                objSprites = [];
                gameObjectSprites = [];
            };
            window.startGrind = function() {
                if (configs3.WeaponGrinder) {
                    for (let i = 0; i < Math.PI * 2; i += Math.PI / 2) {
                        checkPlace(player.getItemType(22), i);
                    }
                }
            };
            window.resBuild = function() {
                if (gameObjects.length) {
                    gameObjects.forEach((tmp) => {
                        tmp.breakObj = false;
                    });
                    breakObjects = [];
                }
            };
            window.toggleBotsCircle = function() {
                player.circle = !player.circle;
            };
            window.AutoBot = function() {
                config.autobot = !config.autobot;
            };
            window.zoomvis = function() {
                zoomVision();
            };

            window.Leaderboard = function() {
                $("#topInfoHolder").toggle();
                if(topInfoHolder) {
                    topInfoHolder = false;
                    $("#storeButton").css({'right': '140px'});
                    $("#allianceButton").css({'right': '80px'});
                    $("#leaderboardButton").css({'right': '20px'});
                    $(".sizingTime").css({'right': '200px', 'top': '25px'});
                } else {
                    topInfoHolder = true;
                    $("#storeButton").css({'right': '390px'});
                    $("#allianceButton").css({'right': '330px'});
                    $("#leaderboardButton").css({'right': '270px'});
                    $(".sizingTime").css({'right': '270px', 'top': '80px'});
                }
            };
            let myVariable = true;
            window.FpsBoost = function() {
                myVariable = !myVariable;
                if(myVariable) {
                    document.getElementById("woodDisplay").style.display = "none";
                    document.getElementById("stoneDisplay").style.display = "none";
                    document.getElementById("foodDisplay").style.display = "none";
                    $("#killCounter").css({'bottom': '75px'});
                } else {
                    document.getElementById("woodDisplay").style.display = "block";
                    document.getElementById("stoneDisplay").style.display = "block";
                    document.getElementById("foodDisplay").style.display = "block";
                    $("#killCounter").css({'bottom': '240px'});
                }
            };
            window.toggleVisual = function() {
                config.anotherVisual = !config.anotherVisual;
                gameObjects.forEach((tmp) => {
                    if (tmp.active) {
                        tmp.dir = tmp.lastDir;
                    }
                });
            };
            window.toggleVisualTurn = function() {
                config.anotherVisualTurn = !config.anotherVisualTurn;
            };
            window.prepareUI = function(tmpObj) {
                resize();
                UTILS.removeAllChildren(actionBar);
                for (let i = 0; i < (items.weapons.length + items.list.length); ++i) {
                    (function(i) {
                        UTILS.generateElement({
                            id: "actionBarItem" + i,
                            class: "actionBarItem",
                            style: "display:none",
                            onmouseout: function() {
                                showItemInfo();
                            },
                            parent: actionBar
                        });
                    })(i);
                }
                for (let i = 0; i < (items.list.length + items.weapons.length); ++i) {
                    (function(i) {
                        let tmpCanvas = document.createElement("canvas");
                        tmpCanvas.width = tmpCanvas.height = 66;
                        let tmpContext = tmpCanvas.getContext("2d");
                        tmpContext.translate((tmpCanvas.width / 2), (tmpCanvas.height / 2));
                        tmpContext.imageSmoothingEnabled = false;
                        tmpContext.webkitImageSmoothingEnabled = false;
                        tmpContext.mozImageSmoothingEnabled = false;
                        if (items.weapons[i]) {
                            tmpContext.rotate((Math.PI / 4) + Math.PI);
                            let tmpSprite = new Image();
                            toolSprites[items.weapons[i].src] = tmpSprite;
                            tmpSprite.onload = function() {
                                this.isLoaded = true;
                                let tmpPad = 1 / (this.height / this.width);
                                let tmpMlt = (items.weapons[i].iPad || 1);
                                tmpContext.drawImage(this, -(tmpCanvas.width * tmpMlt * config.iconPad * tmpPad) / 2, -(tmpCanvas.height * tmpMlt * config.iconPad) / 2,
                                                     tmpCanvas.width * tmpMlt * tmpPad * config.iconPad, tmpCanvas.height * tmpMlt * config.iconPad);
                                tmpContext.fillStyle = "rgba(0, 0, 70, 0.1)";
                                tmpContext.globalCompositeOperation = "source-atop";
                                tmpContext.fillRect(-tmpCanvas.width / 2, -tmpCanvas.height / 2, tmpCanvas.width, tmpCanvas.height);
                                getEl('actionBarItem' + i).style.backgroundImage = "url(" + tmpCanvas.toDataURL() + ")";
                            };
                            tmpSprite.src = "./../img/weapons/" + items.weapons[i].src + ".png";
                            let tmpUnit = getEl('actionBarItem' + i);
                            tmpUnit.onmouseover = UTILS.checkTrusted(function() {
                                showItemInfo(items.weapons[i], true);
                            });
                            tmpUnit.onclick = UTILS.checkTrusted(function() {
                                selectWeapon(tmpObj.weapons[items.weapons[i].type]);
                            });
                            UTILS.hookTouchEvents(tmpUnit);
                        } else {
                            let tmpSprite = getItemSprite(items.list[i - items.weapons.length], true);
                            let tmpScale = Math.min(tmpCanvas.width - config.iconPadding, tmpSprite.width);
                            tmpContext.globalAlpha = 1;
                            tmpContext.drawImage(tmpSprite, -tmpScale / 2, -tmpScale / 2, tmpScale, tmpScale);
                            tmpContext.fillStyle = "rgba(0, 0, 70, 0.1)";
                            tmpContext.globalCompositeOperation = "source-atop";
                            tmpContext.fillRect(-tmpScale / 2, -tmpScale / 2, tmpScale, tmpScale);
                            getEl('actionBarItem' + i).style.backgroundImage = "url(" + tmpCanvas.toDataURL() + ")";
                            let tmpUnit = getEl('actionBarItem' + i);
                            tmpUnit.onmouseover = UTILS.checkTrusted(function() {
                                showItemInfo(items.list[i - items.weapons.length]);
                            });
                            tmpUnit.onclick = UTILS.checkTrusted(function() {
                                selectToBuild(tmpObj.items[tmpObj.getItemType(i - items.weapons.length)]);
                            });
                            UTILS.hookTouchEvents(tmpUnit);
                        }
                    })(i);
                }
            };
            window.profineTest = function(data) {
                if (data) {
                    let noname = "unknown";
                    let name = data + "";
                    name = name.slice(0, config.maxNameLength);
                    name = name.replace(/[^\w:\(\)\/? -]+/gmi, " ");
                    name = name.replace(/[^\x00-\x7F]/g, " ");
                    name = name.trim();
                    let isProfane = false;
                    let convertedName = name.toLowerCase().replace(/\s/g, "").replace(/1/g, "i").replace(/0/g, "o").replace(/5/g, "s");
                    if (name.length > 0 && !isProfane) {
                        noname = name;
                    }
                    return noname;
                }
            };
            window.toggleNight();
        },
        webgl_test: () => {
            return;
            let canvas = document.createElement("canvas");
            canvas.id = "WEBGL";
            canvas.width = canvas.height = 300;
            canvas.style = `
            position: relative;
            bottom: 70%;
            left: 70%;
            pointer-events: none;
            `;
            let fat = document.createElement("div");
            fat.id = "faku";
            fat.width = fat.height = 300;
            fat.style = `
            position: relative;
            bottom: 70%;
            left: 70%;
            pointer-events: none;
            font-size: 20px;
            `;
            fat.innerHTML = "Webgl Test Rendering";
            let gl = canvas.getContext("webgl");
            if (!gl) {
                alert("urbad");
                return;
            }
            document.body.append(canvas);
            document.body.append(fat);
            log(gl);
            gl.clearColor(0, 0, 0, 0.2);
            gl.clear(gl.COLOR_BUFFER_BIT);
            let buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            function render(vs, fs, vertice, type) {
                let vShader = gl.createShader(gl.VERTEX_SHADER);
                gl.shaderSource(vShader, vs);
                gl.compileShader(vShader);
                gl.getShaderParameter(vShader, gl.COMPILE_STATUS);
                let fShader = gl.createShader(gl.FRAGMENT_SHADER);
                gl.shaderSource(fShader, fs);
                gl.compileShader(fShader);
                gl.getShaderParameter(fShader, gl.COMPILE_STATUS);
                let program = gl.createProgram();
                gl.attachShader(program, vShader);
                gl.attachShader(program, fShader);
                gl.linkProgram(program);
                gl.getProgramParameter(program, gl.LINK_STATUS);
                gl.useProgram(program);
                let vertex = gl.getAttribLocation(program, "vertex");
                gl.enableVertexAttribArray(vertex);
                gl.vertexAttribPointer(vertex, 2, gl.FLOAT, false, 0, 0);
                let vertices = vertice.length / 2;
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertice), gl.DYNAMIC_DRAW);
                gl.drawArrays(type, 0, vertices);
            }
            function hexToRgb(hex) {
                return hex.slice(1).match(/.{1,2}/g).map(g => parseInt(g, 16));
            }
            function getRgb(r, g, b) {
                return [r / 255, g / 255, b / 255].join(", ");
            }
            let max = 50;
            for (let i = 0; i < max; i++) {
                let radian = (Math.PI * (i / (max / 2)));
                render(`
                precision mediump float;
                attribute vec2 vertex;
                void main(void) {
                    gl_Position = vec4(vertex, 0, 1);
                }
                `, `
                precision mediump float;
                void main(void) {
                    gl_FragColor = vec4(${getRgb(...hexToRgb("#cc5151"))}, 1);
                }
                `, [
                    0 + (Math.cos(radian) * 0.5), 0 + (Math.sin(radian) * 0.5),
                    0, 0,
                ], gl.LINE_LOOP);
            }
        }
    };
    if (codes) {
        for (let code in codes) {
            let func = codes[code];
            typeof func === "function" && func();
        }
        window.enableHack = function() {
            if (!useHack) {
                useHack = true;
                codes.main();
            }
        };
    }
}(1);
//window.devicePixelRatio = 0.2;
//selectSkinColor(4);
document.getElementById("woodDisplay").remove();
document.getElementById("stoneDisplay").remove();
document.getElementById("foodDisplay").remove();