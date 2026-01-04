// ==UserScript==
// @name         WildBerries цена за кг
// @namespace    price_per_kiloWB
// @version      1.1
// @description  Добавляет отображение цены за кг у товаров где указаны вес (и количество) и сортирует по цене за кг
// @author       Owyn
// @match        https://www.wildberries.ru/*
// @run-at       document-end
// @noframes
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412354/WildBerries%20%D1%86%D0%B5%D0%BD%D0%B0%20%D0%B7%D0%B0%20%D0%BA%D0%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/412354/WildBerries%20%D1%86%D0%B5%D0%BD%D0%B0%20%D0%B7%D0%B0%20%D0%BA%D0%B3.meta.js
// ==/UserScript==

(function() {
	"use strict";

	function work()
	{
		let products = document.body.querySelectorAll('a.product-card__link');
        //if(products.length) { products[0].parentNode.style = "display: grid; grid-template-columns:repeat(4, 1fr);";}
		let price, weight, number, price_per_kilo, price_node, workdone, kilo, explained;
		for(let i = 0; i < products.length; i++)
		{
			/*if(products[i].className === "a3g4") // loading
			{
				//setTimeout(function() { work(); }, 300);
				break;
			}*/
			/*if(products[i].style.order) // ??
			{
				continue;
			}*/
            //products[i].style.minWidth = "252px";
			price_node = products[i].parentNode.querySelector(".price__lower-price")
			if(!price_node || price_node.ariaLabel) continue;
			price = parseInt(price_node.textContent.replace(/\s+/g, ''));
			if(!price) continue;
            weight = products[i].ariaLabel; //querySelector("span.goods-name.c-text-sm")
			if(!weight)
			{
				continue;
			}
			//weight = weight.textContent;
            number = weight;
            kilo = false;
            explained = false;
			let weight_res = weight.match(/\d+( )?(?!года)(грамм|г|гр|мл)/g);
			if(!weight_res)
			{
				weight_res = weight.match(/(\d(\.|\,))?\d+( )?(кг|л|литр|кило)/g);
				kilo = true;
			}
			if(weight_res)
			{
				if(weight_res.length > 1) {explained = true;}
				/*if(weight_res.length > 1 && weight.match(/набор/gi))
				{
					weight = 0;
					for(let k = 0; k < weight_res.length; k++)
					{
						weight_res[k] = weight_res[k].replace(',', '.');
						weight = weight + parseFloat(weight_res[k]);
					}
				}
				else
				{*/
					weight_res[0] = weight_res[0].replace(',', '.');
					weight_res[0] = weight_res[0].replace(/^0(\d)/g, "0.$1"); // exc
					weight = parseFloat(weight_res);
				//}
			}
			if(kilo)
			{
				weight = weight * 1000;
			}
			let number_res;
			let exc1 = number.match(/(\d)(x|х)( )?(\d)+/u);
			if(exc1 && exc1[1] && !explained)
			{
				number_res = parseInt(exc1[1]);
			}
			else
			{
				exc1 = number.match(/(?<![A-Za-zа-яА-ЯёЁ])(x|х)( )?(\d)+/g);
				if(exc1 && !explained)
				{
					number_res = parseInt(exc1[0].replace('x','').replace('х',''));
				}
				else
				{
					number_res = parseInt(number.match(/\d+( )?(шт|пачки|уп|коробки|пакетов)/g)) || 1;
				}
			}
			if(weight)
			{
				price_per_kilo = Math.round(1000/(weight*number_res)*price);
				price_node.innerHTML += "<br>"+price_per_kilo+" ₽/кг";
                console.log("weight: " + weight + ", number: " + number_res + ", price: " + price + ", price_per_kilo: " + price_per_kilo);
                price_node.parentNode.parentNode.className = ""; // make it stay
                price_node.ariaLabel = "skip";
			}
			products[i].style.order = weight ? price_per_kilo : 99999;
			workdone = true;
		}
		if(workdone)
		{
			let previews = document.body.querySelectorAll('.thumbnail');
			for(let i = 0; i < previews.length; i++)
			{
				if(previews[i].dataset.original && previews[i].dataset.original !== previews[i].src)
				{
					previews[i].src = previews[i].dataset.original; // sorry else it doesn't load at all
				}
			}
			workdone = false;
		}
	}
	setInterval(function() { work(); }, 2000); // cuz ajax page loading
})();