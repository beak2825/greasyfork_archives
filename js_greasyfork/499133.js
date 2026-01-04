// ==UserScript==
// @name         Yahoo Auctions Script
// @namespace    http://tampermonkey.net/
// @author       Norbert Roclawski
// @match        https://auctions.yahoo.co.jp/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yahoo.co.jp
// @grant        none
// @description  This is a yahoo auctions user script allowing users to hide returned listings.
// @license      GNU GPLv3
// @version 0.3.0.0
// @downloadURL https://update.greasyfork.org/scripts/499133/Yahoo%20Auctions%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/499133/Yahoo%20Auctions%20Script.meta.js
// ==/UserScript==
// ==UserScript==
// @match        https://auctions.yahoo.co.jp/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yahoo.co.jp
// ==/UserScript==
// ==UserScript==
// @match        https://auctions.yahoo.co.jp/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yahoo.co.jp
// ==/UserScript==
// ==UserScript==
// @match        https://auctions.yahoo.co.jp/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yahoo.co.jp
// ==/UserScript==
// ==UserScript==
// @match        https://auctions.yahoo.co.jp/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yahoo.co.jp
// ==/UserScript==
// ==UserScript==
// @match        https://auctions.yahoo.co.jp/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yahoo.co.jp
// ==/UserScript==
// ==UserScript==
// @match        https://auctions.yahoo.co.jp/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yahoo.co.jp
// ==/UserScript==
// ==UserScript==
// @match        https://auctions.yahoo.co.jp/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yahoo.co.jp
// ==/UserScript==
// ==UserScript==
// @match        https://auctions.yahoo.co.jp/search/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yahoo.co.jp
// ==/UserScript==

(function() {
  'use strict';
  function querystring(key) {
 var re=new RegExp('(?:\\?|&)'+key+'=(.*?)(?=&|$)','gi');
 var r=[], m;
 while ((m=re.exec(document.location.search)) != null) r[r.length]=m[1];
 return r;
}

  const getSearchScopedHiddenListingsFromLocalStorage = (searchPhrase = querystring("p")[0]) => {
    return JSON.parse(localStorage.getItem(`hidden-${searchPhrase}`)) || [];
  }

  const setSearchScopedHiddenListingsFromLocalStorage = (newValue, searchPhrase = querystring("p")[0]) => {
    const uniqueValues = [...new Set(newValue)];
    return localStorage.setItem(`hidden-${searchPhrase}`, JSON.stringify(uniqueValues));
  }

  const addIdToHiddenList = (id) => {
    const hiddenList = getSearchScopedHiddenListingsFromLocalStorage();
    setSearchScopedHiddenListingsFromLocalStorage([...hiddenList, id]);
  }

  const createHtmlElement = (tag, classNames = [], attributes = {}, content = '') => {
      const element = document.createElement(tag);

      if (classNames.length > 0) {
          element.classList.add(...classNames);
      }

      Object.entries(attributes).forEach(([attributeName, value]) => {
          element.setAttribute(attributeName, value);
      });

      if (Array.isArray(content)) {
          content.forEach((item) => {
              if (item instanceof Node) {
                  element.appendChild(item);
              } else {
                  element.appendChild(document.createTextNode(item));
              }
          });
      } else if (content instanceof Node) {
          element.appendChild(content);
      } else {
          element.textContent = content;
      }

      return element;
  };

  const updateUrlParams = (url, params) => {
      const urlObj = new URL(url);

      for (const [key, value] of Object.entries(params)) {
          // Check if the parameter exists in the URL
          if (urlObj.searchParams.has(key)) {
              // If it exists, update the value
              urlObj.searchParams.set(key, value);
          } else {
              // If it doesn't exist, append it
              urlObj.searchParams.append(key, value);
          }
      }

      return urlObj.toString();
}

const convertImageToBase64 = async (url) => {
  try {
      const response = await fetch(url);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
      });
  } catch (error) {
      console.error('Error:', error);
  }
};

const createModal = (productData) => {
  // Modal title
  const closeModalButton = createHtmlElement('span', [], {
  style: `
        float: right;
  font-size: 2rem;
  cursor: pointer;
  `}, 'x');
      const modalTitle = createHtmlElement('h1', [], {
        style: `
        text-align: center;
        font-size: 2rem;
        `
      }, 'Copy the listing to Shopify');
      const titleLabel = createHtmlElement('h2', [], {
        style: `
            font-size: 1.2rem;
            padding: 0.25rem 0;
        `
      }, 'Add Title');
      const titleInput = createHtmlElement('input', ['modal-text-input'], {
      style: `
          width: 95%;
          margin-bottom: 10px;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          resize: none;
    margin: 0 0 1rem;
      `,
      placeholder: 'Enter your title here...'
      });
      //titleInput.value = productData.title;
      const descriptionLabel = createHtmlElement('h2', [], {
        style: `
          font-size: 1.2rem;
          padding: 0.25rem 0 0;
          `
      }, 'Add Description');


  const descriptionTextarea = createHtmlElement('textarea', ['modal-textarea'], {
      style: `
          width: 95%;
          height: 100px;
          margin-bottom: 1rem;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          resize: none;
          font-family: sans-serif;
      `,
      placeholder: 'Enter your description here...'
  });
      const priceText = createHtmlElement('h2', [], {
        style: `
        font-size: 1.2rem;
        padding: 0.25rem 0 0;
        `
      }, 'Starting price');
      const priceInput = createHtmlElement('input', ['number-input'], {
      style: `
          margin-bottom: 10px;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 4px;
          resize: none;
      `,
      type: 'number',
      label: 'price',
  });

  const initialPriceText = createHtmlElement('h2', [], {
    style: `
    font-size: 1.2rem;
    padding: 0.25rem 0 0;
    `
  }, `Initial price + 30% import fees: ${productData.price*1.3} JPY`);

  const shippingCostText = createHtmlElement('h2', [], {
    style: `
    font-size: 1.2rem;
    padding: 0.25rem 0 0;
    `
  }, 'Shpping cost');
  const shippingCostInput = createHtmlElement('input', ['number-input'], {
  style: `
      margin-bottom: 10px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      resize: none;
  `,
  type: 'number',
  label: 'Shipping cost',
});

const profitText = createHtmlElement('h2', [], {
  style: `
  font-size: 1.2rem;
  padding: 0.25rem 0 0;
  `
}, 'Profit');
const profitInput = createHtmlElement('input', ['number-input'], {
style: `
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    resize: none;
`,
type: 'number',
label: 'profit',
});


  const reservePriceText = createHtmlElement('h2', [], {
    style: `
    font-size: 1.2rem;
    padding: 0.25rem 0 0;
    `
  }, 'Reserve price');
  const reservePriceInput = createHtmlElement('input', ['number-input'], {
  style: `
      margin-bottom: 10px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      resize: none;
  `,
  type: 'number',
  label: 'reserve price',
});
const imageInputLabel = createHtmlElement('h2', [], {
  style: `
    font-size: 1.2rem;
    padding: 0.25rem 0 0;
  `,
}, 'Attach image (note that the url to listing image is in your clipboard)');
      const uploadImageButton = createHtmlElement('input', ['imageInput'], {
          id: 'imageInput',
      style: `
          padding: 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
          margin: 0 0 1rem;
      `,
       accept: "image/*",
       type: "file",
  }, 'Attach an image');

  const submitButton = createHtmlElement('button', ['modal-submit-button'], {
      style: `
          background-color: #004868;
          color: white;
          padding: 10px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
          margin: 0.5rem 0;
    font-size: 1.5rem;
    font-weight: 600;
        box-shadow: 0 0 4px 0px #526d79;
      `
  }, 'Submit');

  const modalContainer = createHtmlElement('div', ['modal-container'], {
      style: `
          background-color: white;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          width: 25vw;
          max-width: 100%;
          z-index: 1001;
    font-family: sans-serif;
      `
  }, [closeModalButton, modalTitle, titleLabel, titleInput, descriptionLabel, descriptionTextarea, initialPriceText, shippingCostText, shippingCostInput, profitText, profitInput, reservePriceText, reservePriceInput, submitButton]);
  const modalOverlay = createHtmlElement('div', ['modal-overlay'], {
      style: `
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
      `
  }, modalContainer);

  // Close modal function
  const closeModal = () => {
      document.body.removeChild(modalOverlay);
  };
  closeModalButton.addEventListener('click', () => {
   closeModal();
  })
      let base64Img;
  // Add event listener to submit button
  submitButton.addEventListener('click', () => {

       const userDescription = descriptionTextarea.value;
      const userPrice = priceInput.value;
      const shopifyData = {
          description: userDescription,
          ...productData,
          title: titleInput.value,
          imageBase: productData.base64Image,
          price: userPrice,
          reservePrice: reservePriceInput.value,
          initialPrice: productData.price,
          shippingCost: shippingCostInput.value,
          profit: profitInput.value,
      };

      console.log('Shopify Data:', shopifyData);
      fetch('https://13.60.151.138:3000/shopify-data', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(shopifyData)
  })
  .then(response => {
    if (!response.ok) {
        return response.json().then(errorData => {
            if (response.status === 400) {
                alert(`Error: ${errorData.message}`);
                console.error('Error details:', errorData.error);
            } else {
                alert('Error creating product. See console log for more information.');
                console.error('Error creating product:', errorData);
            }
            throw new Error('Error response from server');
        });
    }
    return response.json();
})
.then(data => {
    alert('Product created successfully. See console log for more information.');
    console.log('Product created successfully:', data);
    // Optionally, handle success (e.g., display a success message, update the UI, etc.)
})
.catch(error => {
    if (error.message !== 'Error response from server') {
        alert('Error creating product. See console log for more information.');
        console.error('Error creating product:', error);
    }
    // Optionally, handle errors (e.g., display an error message)
});



      // Close the modal after submission
      closeModal();
  });
  // Append the modal overlay to the body
  document.body.appendChild(modalOverlay);
};

  const createCard = (item) => {
      const cardStyles = "border: 1px solid #ddd; border-radius: 4px; width: 300px; margin: 10px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); display: flex; flex-direction: column; justify-content: space-between;";
      const cardBodyStyles = "padding: 15px; display: flex; flex-direction: column;";
      const imgStyles = "width: 100%; border-top-left-radius: 4px; border-top-right-radius: 4px;";
      const titleStyles = "font-size: 18px; font-weight: bold; margin: 0 0 10px;";
      const textStyles = "margin: 5px 0;";
      const buttonStyles = "padding: 5px 10px; background-color: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;";
      const copyButtonStyles = "padding: 5px 10px; background-color: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 1rem;";

      const img = createHtmlElement('img', [], { src: item.image || '', alt: item.title || 'Image', style: imgStyles, load: 'lazy' });

      const titleLink = createHtmlElement('a', [], { href: `https://page.auctions.yahoo.co.jp/jp/auction/${item.id}`, target: '_blank', style: titleStyles }, item.title || 'No Title');
      const title = createHtmlElement('h5', [], {}, [titleLink]);
      const price = createHtmlElement('p', [], { style: textStyles }, `Price: ${item.price || 'N/A'}`);
      const bids = createHtmlElement('p', [], { style: textStyles }, `Bids: ${item.bids !== undefined ? item.bids : 'N/A'}`);
      const timeLeft = createHtmlElement('p', [], { style: textStyles }, `Time left: ${item.timeLeft || 'N/A'}`);
      const isUnusedText = item.isUnused ? 'Unused' : 'Used';
      const isUnused = createHtmlElement('p', [], { style: textStyles }, `Condition: ${isUnusedText}`);

      const hideButton = createHtmlElement('button', [], { style: buttonStyles }, 'Hide');
      hideButton.addEventListener('click', () => {
          addIdToHiddenList(item.id);
          const cardElement = document.getElementById(`consolidated-${item.id}`)
          cardElement.style.display = 'none';
      });
      const copyButton = createHtmlElement('button', [], { style: copyButtonStyles }, 'Copy');
      copyButton.addEventListener('click', () => handleClickOnCopyButton({auctionId: item.id, title: item.title, imageUrl: item.image, price: item.price, timeLeft: item.timeLeft}));

      const cardBody = createHtmlElement('div', [], { style: cardBodyStyles }, [title, price, bids, timeLeft, isUnused, hideButton, copyButton]);

      return createHtmlElement('div', [], { style: cardStyles, id: `consolidated-${item.id}` }, [img, cardBody]);
  };



const handleClickOnCopyButton = async (data) => {
  const { auctionId, title, imageUrl, price, timeLeft } = data;
  // Extract the relevant data from the listing

 // const imgbase = await getBase64FromImageUrl(imageUrl);
   if (timeLeft === '終了') {
    alert('Auction has already ended');
    return;
   };

   const productImages = await extractAllAuctionImages('https://page.auctions.yahoo.co.jp/jp/auction/' + data.auctionId)
   const imageBases = await Promise.allSettled(productImages.map(image => convertImageToBase64(image)))
   const base64Image = await convertImageToBase64(imageUrl.match(/(.+\.jpg)/)[0]);

  // Create an object to hold the data
  const productData = {
      auctionId,
      title,
      base64Image,
      base64Images: imageBases.filter(el => el.status === 'fulfilled').map(el =>el.value),
      price,
      timeLeft
  };

  // Here you could send this data to your Shopify store or save it for later
  console.log('Product Data:', productData);

  createModal(productData);
};

const hideListingById = (id) => {
  const listings = document.querySelectorAll(`a[data-auction-id="${id}"]`);
  if (listings) {
      listings.forEach((listing) => {
          listing.parentElement.parentElement.style.display = 'none';
      });
  }
};

const handleClickOnRemoveButton = (listing, storedIds) => {
  const productData = listing.children[1];
  const id = productData.children[0].getAttribute('data-auction-id');

  listing.style.display = 'none';

  if (!storedIds.includes(id)) {
      storedIds.push(id);
      //localStorage.setItem('hiddenListings', JSON.stringify(storedIds));
      setSearchScopedHiddenListingsFromLocalStorage(storedIds);
  }
};

const addRemoveButtonToListing = (listing, storedIds) => {
  try {
      const image = listing.children[0];
      const el = createHtmlElement('div', ['WatchButtonWrap-ct']);
      const btn = createHtmlElement('button', [], {
          style: 'background-color: #ff4d4d; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; position: absolute; top: 10px; right: 10px;'
      }, 'hide');

      btn.addEventListener('click', () => handleClickOnRemoveButton(listing, storedIds));

      el.appendChild(btn);
      image.appendChild(el);

  } catch (err) {
      console.log(err);
  }
};

const addCopyButtonToListing = (listing) => {
  try {
      const image = listing.children[0];
      const el = createHtmlElement('div', ['WatchButtonWrap-ct']);
      const btn = createHtmlElement('button', [], {
          style: 'background-color: #ff4d4d; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; position: absolute; bottom: 10px; left: 10px;'
      }, 'copy');

      // Update the event listener to use handleClickOnCopyButton
      const auctionId = listing.querySelector('a').getAttribute('data-auction-id');
      const title = listing.querySelector('a').getAttribute('data-auction-title');
      const imageUrl = listing.querySelector('a').getAttribute('data-auction-img');
      const price = listing.querySelector('a').getAttribute('data-auction-price');
    const timeLeftElement = listing.querySelector('.Product__time');
      const timeLeft = timeLeftElement ? timeLeftElement.textContent.trim() : '終了';
      btn.addEventListener('click', async () => await handleClickOnCopyButton({auctionId, title, imageUrl, price, timeLeft}));

      el.appendChild(btn);
      image.appendChild(el);

  } catch (err) {
      console.log(err);
  }
};

  const createTab = (classNames, textContent, clickHandler) => {
      const tab = createHtmlElement('li', ['Tab__item'], {}, [
          createHtmlElement('a', ['Tab__itemInner'], { href: '#', rel: 'nofollow' }, [
              createHtmlElement('span', ['Tab__text'], { style: 'text-align: center; padding: 0 0.25rem;' }, textContent),
          ])
      ]);

      tab.addEventListener('click', clickHandler);

      return tab;
  };

const processListings = async (url, storedIds) => {
  let combineListings = [];
  try {
      const response = await fetch(url);
      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const newListings = doc.querySelectorAll("li[class^=Product]");
      if (!newListings) console.log('no new listings, url: ', url);

      for (const listing of newListings) {
       if (!listing){
           console.log('no listing, url: ', url);
          }
          const id = listing.querySelector('a').getAttribute('data-auction-id');
          if (!id){
           console.log('no id, listing: ', listing);
          }
         // if (!storedIds.includes(id)) {
              const image = listing.querySelector('.Product__imageData')?.src || '';
              const title = listing.querySelector('.Product__titleLink')?.textContent || '';
              const price = listing.querySelector('.Product__priceValue.u-textRed')?.textContent || '';
              const bids = listing.querySelector('.Product__bid')?.textContent || '';
              const timeLeft = listing.querySelector('.Product__time')?.textContent || '';
              const isUnused = listing.querySelector('.Product__icon--unused') ? true : false;
              let b = {
                  id,
                  image,
                  title,
                  price,
                  bids,
                  timeLeft,
                  isUnused
              }

              combineListings.push({
                  id,
                  image,
                  title,
                  price,
                  bids,
                  timeLeft,
                  isUnused
              });
      }
  if (combineListings.length !== 100) console.log(combineListings);
  return combineListings.filter((listing) => !storedIds.includes(listing.id));
  } catch (err) {
      console.log('processed listing err: ', err);
      return false;
  }
};

const extractAllAuctionImages = async (url) => {
  try {
    const response = await fetch(url);
    const text = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'text/html');

    // Extract the ul with class ProductImage__images
    const ul = doc.querySelector('ul.ProductImage__images');
    if (!ul) {
      console.log('No ul with class ProductImage__images found');
      return false;
    }

    // Extract each image src from the descendants
    const imageSrcs = [];
    ul.querySelectorAll('li.ProductImage__image img').forEach(img => {
      imageSrcs.push(img.src.match(/(.+\.jpg)/)[0]);
    });

    return imageSrcs;

  } catch (err) {
    console.log('error: ', err);
    return false;
  }
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const fetchListingsBatch = async (urls, storedIds, batchSize, maxRetries = 3) => {
  let allListings = [];
  let failedUrls = [...urls];
  let processedCount = 0;
  console.log('org urls: ', failedUrls.length);
  console.log('org urls: ', failedUrls);
let attempt = 0
  for (;failedUrls.length > 0;) {
      let batchUrls = failedUrls.splice(0, batchSize);
      let batchPromises = batchUrls.map(url => processListings(url, storedIds));
      let batchResults = await Promise.allSettled(batchPromises);

      batchResults.forEach((result, index) => {
          if (result.status === 'fulfilled' && result.value !== false) {
               if (result.value.length !== 100) console.log(result.value);
              allListings = allListings.concat(result.value);
              processedCount += result.value.length;
          } else {
              failedUrls.push(batchUrls[index]);
          }
      });

      if (processedCount >= 15003) {
          console.log(`Processed ${processedCount} listings. Waiting for 1 minute...`);
          //await delay(120000);
          processedCount = 0; // Reset the count after waiting
      }
      await delay(2000);
  }
  console.log('attempts: ', attempt);
  console.log('urls: ', failedUrls.length)
  console.log('urls: ', failedUrls)

  return allListings;
};

const removeHasthagFromString = string => string[-1] === '#' ? string.slice(0, -1) : string;

const fetchListings = async (numListings, baseUrl, startIndex = 1, batchSize = 10) => {
  const allListingsUrls = [];
  const urlParams = new URLSearchParams(window.location.search);
  const initialB = urlParams.has('b') ? parseInt(urlParams.get('b'), 10) : 1;

  for (let b = parseInt(initialB, 10); b <= numListings; b += 100) {
      allListingsUrls.push(updateUrlParams(removeHasthagFromString(baseUrl), {b: b.toString(), n: '100'}));
  }

  const storedIds = getSearchScopedHiddenListingsFromLocalStorage();
  const combinedResults = await fetchListingsBatch(allListingsUrls, storedIds, batchSize);

  return combinedResults;
};

  // Retrieve stored IDs from localStorage
  const storedIds = getSearchScopedHiddenListingsFromLocalStorage(); //JSON.parse(localStorage.getItem('hiddenListings') || '[]');

  // Hide listings with stored IDs
  storedIds.forEach(id => hideListingById(id));

  // Add "rm" button to each listing
  const listings = document.querySelectorAll("li[class^=Product]");
  console.log('example listing: ', listings[0]);
  listings.forEach((listing) => {
  addRemoveButtonToListing(listing, storedIds);
  addCopyButtonToListing(listing);
  });

  let firstTabTextNode = document.getElementsByClassName('Tab__items')[0].children[0].children[0].children[1];
  firstTabTextNode.innerHTML = `${firstTabTextNode.innerHTML} (${getSearchScopedHiddenListingsFromLocalStorage().length} hidden)`

  const tabItems = document.querySelector('.Tab__items');

  if (tabItems) {
      const consolidatedTabClickHandler = async (e) => {
          e.preventDefault();

          //document.getElementsByClassName('Pager__lists')[0].remove()

          const firstTab = document.querySelector('.Tab__items').children[0];
          const numListingsText = firstTab.querySelector('.Tab__subText').textContent;
          const numListings = parseInt(numListingsText.match(/([\d,]+)/)[0].replaceAll(',', ''), 10);
          console.log('STARTING TO FETCH LISTINGS. NUMBER OF LISTINGS: ', numListings);

          const baseUrl = window.location.href;
          const allListings = await fetchListings(numListings, baseUrl);

          const listingsWrapper = document.getElementsByClassName('Products__list')[0];
          listingsWrapper.innerHTML = '';
          listingsWrapper.style = 'display: flex; flex-wrap: wrap;';
          allListings.map(createCard).forEach(card => listingsWrapper.appendChild(card));

          const prevTab = document.querySelector('.Tab__item--current');
          prevTab.classList.remove('Tab__item--current');
          //e.currentTarget.className = 'Tab__item Tab__item--current';
          const el = document.getElementsByClassName('Tab__items')[0].children[3];
          el.classList.add('Tab__item--current');
          if (!localStorage.wasShownWarning) {
              alert('Consolidated listings tab opened. Please do not refresh or change tabs because the results will have to be re-generated again. This information will not be shown next time.');
              localStorage.wasShownWarning = true;
          }
          alert(`${allListings.length} listings rendered`)
          const hideConsolidatedListingsTabClickHandler = (e) => {
          e.preventDefault();
              const storedIds = getSearchScopedHiddenListingsFromLocalStorage(); //JSON.parse(localStorage.getItem('hiddenListings') || '[]');
          allListings.forEach(({ id }) => {
           if (!storedIds.includes(id)) {
            storedIds.push(id);
           }
          });

          //localStorage.setItem('hiddenListings', JSON.stringify(storedIds));
          setSearchScopedHiddenListingsFromLocalStorage(storedIds)
           alert(`${storedIds.length} out of ${numListings} listings are hidden`);
          }
          const hideAllConsolidatedListingsTab = createTab(['Tab__item'], 'Add all consolidated listings to the hidden listings list', hideConsolidatedListingsTabClickHandler);
           tabItems.appendChild(hideAllConsolidatedListingsTab);
           if (!localStorage.wasShownWarning2) {
              alert('You can use "Add all consolidated listings..." tab to add all currently rendered consolidated listings to the list of hidden listings.');
              localStorage.wasShownWarning2 = true;
          }
      };

      const consolidatedTab = createTab(['Tab__item'], 'Consolidate not hidden listings', consolidatedTabClickHandler);
      tabItems.appendChild(consolidatedTab);

      const hideAllListingsTabClickHandler = async (e) => {
          e.preventDefault();

          const firstTab = document.querySelector('.Tab__items').children[0];
          const numListingsText = firstTab.querySelector('.Tab__subText').textContent;
          const numListings = parseInt(numListingsText.match(/([\d,]+)/)[0].replaceAll(',', ''), 10);
          console.log('STARTING TO FETCH LISTINGS. NUMBER OF LISTINGS: ', numListings);

          const baseUrl = window.location.href;
          const listings = await fetchListings(numListings, baseUrl);
          const storedIds = getSearchScopedHiddenListingsFromLocalStorage(); //JSON.parse(localStorage.getItem('hiddenListings') || '[]');
          listings.forEach(({ id }) => storedIds.push(id));

          //localStorage.setItem('hiddenListings', JSON.stringify(storedIds));
          setSearchScopedHiddenListingsFromLocalStorage(storedIds)
          alert(`${listings.length} out of ${numListings} listings successfully hidden in this run.`);
      };

      const hideAllListingsTab = createTab(['Tab__item'], 'Hide all listings for this search', hideAllListingsTabClickHandler);
      tabItems.appendChild(hideAllListingsTab);

      const clearHiddenListingsTabClickHandler = async (e) => {
          e.preventDefault();
          if (confirm('Are you sure you want to clear all hidden listings from the storage?')) {
              //localStorage.setItem('hiddenListings', JSON.stringify([]));
              setSearchScopedHiddenListingsFromLocalStorage([]);
              alert('Hidden listings list successfully cleared');
          }
      };

      const clearHiddenListingsTab = createTab(['Tab__item'], 'Clear hidden listings list', clearHiddenListingsTabClickHandler);
      tabItems.appendChild(clearHiddenListingsTab);
  }

  if (!localStorage.askToShowGuideCounter) localStorage.askToShowGuideCounter = 0;
  let counter = parseInt(localStorage.askToShowGuideCounter, 10) + 1;
  localStorage.askToShowGuideCounter = +counter;

  if (counter <= 3) {
     setTimeout(() => {
      if (confirm(`Would you like to read the tutorial? This question will appear ${3 - counter} more times`)) {
          alert('Thank you for installing this script. This is going to be a quick introduction to how to use it.\nThis guide will only be shown once, however feel free to contact me if you have any questions or issues.');
          alert('The goal is to allow you to:\n - hide single listings,\n - hide all listings for the current search,\n - display to you consolidated not hidden results for the current search,\n - clear the current search\'s hidden listings from the memory. Listings for each search phrase are stored separately.');
          alert(`This user script adds a "rm" button to each listing and 3 tabs to the Yahoo Auctions search results page.\n\n"Consolidate not hidden listings" tab allows you to view all the not hidden results for the current search phrase. \nPlease note it might take a couple of minutes for the results to be generated. During this time, it might seem like nothing is happening, but please stay patient, the user script is working in the background.\n\n"Hide all listings for this search" tab allows you to hide almost all returned listings. With this many listings, some requests will not be successful and not all the listings will be hidden. \nAfter the script finishes running, you will be shown a statistic of how many listings were hidden.\n\n"Clear hidden listings list" tab allows you to clear the hidden listings list from memory for the current search. Note this is for the current search only, hidden listings from other searches will stay hidden.`);
          alert(`Please contact me to give me your feedback after using this user script. Based on your notes, we can improve this tool further.\nThank you.`);
      }
     }, 300)
  }
  const paginationButtons = document.querySelector('.Pager__lists');
  const button150Page = createHtmlElement('a', ['Pager__link'],
                                          {href:  updateUrlParams(removeHasthagFromString(window.location.href), {b: '15000', n: '100'}),
                                          'data-cl-params': '_cl_vmodule:pagination;_cl_link:number;_cl_position:11;',
                                          },
                                          '150');
  const buttonWrapper = createHtmlElement('li', ['Pager__list'], {}, button150Page);
  paginationButtons.appendChild(buttonWrapper);


})();