// ==UserScript==
// @name        Joinposter.com Russian to Polish Translator
// @namespace   Violentmonkey Scripts
// @match       https://*.joinposter.com/*
// @grant       none
// @version     0.1
// @author      a0s
// @description Interface translation for joinposter.com from Russian to Polish
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536670/Joinpostercom%20Russian%20to%20Polish%20Translator.user.js
// @updateURL https://update.greasyfork.org/scripts/536670/Joinpostercom%20Russian%20to%20Polish%20Translator.meta.js
// ==/UserScript==

const translations = {
  "Начало работы": "Rozpoczęcie pracy",
  "Статистика": "Statystyki",
  "Продажи": "Sprzedaż",
  "Клиенты": "Klienci",
  "Сотрудники": "Pracownicy",
  "Цехи": "Warsztaty",
  "Категории": "Kategorie",
  "Товары": "Produkty",
  "ABC-анализ": "Analiza ABC",
  "Чеки": "Paragony",
  "Отзывы": "Opinie",
  "Оплаты": "Płatności",
  "Налоги": "Podatki",

  "Финансы": "Finanse",
  "Транзакции": "Transakcje",
  "Cash flow": "Przepływy pieniężne",
  "Кассовые смены": "Zmiany kasowe",
  "Зарплата": "Wynagrodzenia",
  "Счета": "Konta",
  "P&L": "Zyski i straty",

  "Меню": "Menu",
  "Тех. карты": "Karty technologiczne",
  "Полуфабрикаты": "Półprodukty",
  "Ингредиенты": "Składniki",
  "Категории товаров и тех. карт": "Kategorie produktów i kart tech.",
  "Категории ингредиентов": "Kategorie składników",
  "QR-меню": "Menu QR",

  "Склад": "Magazyn",
  "Остатки": "Stany magazynowe",
  "Поставки": "Dostawy",
  "Переработки": "Przetwarzanie",
  "Перемещения": "Przemieszczenia",
  "Списания": "Straty",
  "Отчёт по движению": "Ruch magazynowy",
  "Инвентаризации": "Inwentaryzacje",
  "Поставщики": "Dostawcy",
  "Склады": "Magazyny",
  "Фасовки": "Pakowanie",

  "Маркетинг": "Marketing",
  "Группы клиентов": "Grupy klientów",
  "Программы лояльности": "Programy lojalnościowe",
  "Исключения": "Wyjątki",
  "Акции": "Promocje",

  "Доступ": "Dostęp",
  "Должности": "Stanowiska",
  "Кассы": "Kasy",
  "Заведения": "Placówki",
  "Интеграции": "Integracje",

  "Все приложения": "Wszystkie aplikacje",

  "Настройки": "Ustawienia",
  "Общие": "Ogólne",
  "Оплата подписки": "Płatność abonamentu",
  "Заказы": "Zamówienia",
  "Доставка": "Dostawa",
  "Безопасность": "Bezpieczeństwo",
  "Чек": "Paragon",

  "Рекомендуйте Poster": "Poleć Poster",

  "Корзина": "Kosz",
  "Столбцы": "Kolumny",
  "Экспорт": "Eksport",
  "Импорт": "Import",
  "Печать": "Drukuj",
  "Добавить": "Dodaj",
  "Фильтры": "Filtry",
  "Категория": "Kategoria",
  "Кофе": "Kawa",
  "Выпечка": "Wypieki",
  "Холодные напитки": "Napoje zimne",
  "букеты": "bukiety",
  "цветы поштучно": "kwiaty luzem",
  "композиции": "kompozycje",
  "Цех": "Warsztat",
  "Без цеха": "Bez warsztatu",
  "Мастерская": "Pracownia",
  "Клиентская зона": "Strefa klienta",
  "Налог": "Podatek",
  "Весовая тех. карта": "Techniczna karta wagowa",
  "Нет": "Nie",
  "Да": "Tak",
  "Заведение": "Lokal",
  "Babskie kwiaty": "Babskie kwiaty",  // имя оставить без перевода
  "Отображаются на кассе": "Widoczne na kasie",
  "Применить": "Zastosuj",
  "Быстрый поиск": "Szybkie wyszukiwanie",
  "Фильтр": "Filtr",
  "Название": "Nazwa",
  "Выход": "Wydajność",
  "Себестоимость без НДС": "Koszt netto",
  "Цена": "Cena",
  "Наценка": "Marża",
  "Состав": "Skład",
  "Ред.": "Edytuj"
};

(function () {
    'use strict';

    const sortedKeys = Object.keys(translations).sort((a, b) => b.length - a.length);

    function translateText(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            let text = node.textContent;
            let changed = false;
            for (let key of sortedKeys) {
                if (text.includes(key)) {
                    text = text.replaceAll(key, translations[key]);
                    changed = true;
                }
            }
            if (changed) {
                node.textContent = text;
            }
        } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
            for (let child of node.childNodes) {
                translateText(child);
            }
        }
    }

    // Перевести всё сразу
    translateText(document.body);

    // А теперь следим за появлением новых элементов
    const observer = new MutationObserver(mutations => {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                translateText(node);
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();