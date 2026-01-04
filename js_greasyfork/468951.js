// ==UserScript==
// @name     FuturePost
// @version  1.1
// @include      http://boards.4chan.org/*
// @include      https://boards.4chan.org/*
// @include      http://sys.4chan.org/*
// @include      https://sys.4chan.org/*
// @include      http://www.4chan.org/*
// @include      https://www.4chan.org/*
// @include      http://boards.4channel.org/*
// @include      https://boards.4channel.org/*
// @include      http://sys.4channel.org/*
// @include      https://sys.4channel.org/*
// @include      http://www.4channel.org/*
// @include      https://www.4channel.org/*
// @license MIT
// @require  https://code.jquery.com/jquery-3.5.1.min.js
// @namespace PyonScripts
// @description Extension to 4chanX that adds support for delayed posts. Useful for delaying your posts when you want to keep a slow thread bumped while idle.
// @downloadURL https://update.greasyfork.org/scripts/468951/FuturePost.user.js
// @updateURL https://update.greasyfork.org/scripts/468951/FuturePost.meta.js
// ==/UserScript==

// A separate queue for each page
let pageQueues = {
    '2': [],
    '3': [],
    '4': [],
    '5': [],
    '6': [],
    '7': [],
    '8': [],
    '9': [],
    '10': [],
    '11': []
};

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

// The main loop that will be responsible for posting the enqueued posts
setInterval(function() {
    const pageCountElement = $('#page-count');

    // if post-count has the class warning, don't post anything
    if (document.querySelector("#post-count").classList.contains('warning')) {
        return;
    }

    const currentPage = Number(pageCountElement.text());

    for (let i = 3; i <= currentPage; i++) {
        if (pageQueues[i.toString()] && pageQueues[i.toString()].length > 0) {
            const post = pageQueues[i.toString()].shift();

            document.querySelector('#shortcut-qr a').click()
            delay(1000).then(() =>  {
              if(post.file) {
                var detail = {file: post.file, name: post.fileName};
                if (typeof cloneInto === 'function') {
                  detail = cloneInto(detail, document.defaultView);
                }
                var event = new CustomEvent('QRSetFile', {bubbles: true, detail: detail});
                document.dispatchEvent(event);
              }
              document.querySelector('#qr textarea').value = post.message;

            });
            delay(2000).then(() =>  {
              document.querySelector("#file-n-submit input[type='submit']").click();
              // Attempt to remove the preview from the thread
              const fakePost = document.getElementById(`fp${post.mockNumber}`);
              if (fakePost) {
                fakePost.remove();
              }
            });
            console.log('Remaining queue', pageQueues);
            break;
        }
    }
}, 60000);

function removeFuturePost(postNumber) {
  // Iterate over each page queue in the pageQueues object
  for (const queueName in pageQueues) {
    const queue = pageQueues[queueName];
    // Find the index of the object with a matching postNumber in the queue
    const index = queue.findIndex(obj => obj.mockNumber === postNumber);
    // If the object is found, remove it from the queue
    if (index !== -1) {
      queue.splice(index, 1);
      removePostPreview(postNumber);
      break;
    }
  }
  console.log('Remaining queue', pageQueues);
}

function removePostPreview(postNumber) {
  // Attempt to remove the preview from the thread
  const fakePost = document.getElementById(`fp${postNumber}`);
  if (fakePost) {
    fakePost.remove();
  }
}

function initExtension() {
    var qrElement = document.querySelector('#qr.dialog');
    var futurePostEl = document.querySelector('#future-post');

    // Stop init if it can't find the quickly reply dialog, or if this extension
    // has already been initialized
    if (!qrElement || futurePostEl) {
        return;
    }

    const originalButton = qrElement.querySelector('input[type="submit"]');
    if (!originalButton) {
      return;
    }

    // Create and style your fake button
    var fakeButton = document.createElement('input');
    fakeButton.type = 'submit';
    fakeButton.value = "Submit";
    fakeButton.id = 'future-post';

    // Submit handler for the delayed post button
    fakeButton.addEventListener('click', (e) => {
      e.preventDefault();  // Prevents the default action
      e.stopPropagation(); // Prevents the event from propagating up the DOM tree, preventing any parent handlers from being notified of the event

      // Your custom submit behavior here
      const textArea = $('#qr textarea');
      const fileInput = document.querySelector('#qr input[type="file"]'); // replace with your actual file input ID

      const pageNum = $('#fp-page-num').val();

      let fileBlob;
      let fileName;

      document.addEventListener('QRFile', function(e) {
        if(e.detail) {
          fileName = e.detail.newName;
          fileBlob = new Blob([e.detail], { type: e.detail.type });
        }
      }, false);

      var event = new CustomEvent('QRGetFile', {bubbles: true, detail: null});
      document.dispatchEvent(event);

      // Generate a random post number
      const randomNumber = Math.floor(Math.random() * 1000000);
      let post = {
          mockNumber: randomNumber,
          message: textArea.val(),
          file: fileBlob, // this will be null if no file was selected
          fileName: fileName // this will be null if no file was selected
      };
      pageQueues[pageNum].push(post);

      // Try to reset the form, doings lots of extra stuff i prob don't have to
      $('#fp-checkbox').prop('checked', false).trigger('change');
      fileInput.value = '';
      textArea.val('');
      const closeAnchor = document.querySelector('#qr .close');
      closeAnchor.click();
      console.log(pageQueues);

      // Add a placeholder delayed post to the DOM
      const threadDiv = document.querySelector('.thread');

      // Create a new postContainer element
      const postContainer = document.createElement('div');
      postContainer.classList.add('replyContainer');
      postContainer.id = `fp${post.mockNumber}`

      let fileInfo = '';

      if(fileName) {
        const fileExtension = fileName.split('.').pop().toLowerCase();
        let imgThumb = '';
        if (['jpg', 'gif', 'png', 'jpeg'].includes(fileExtension)) {
          // Create a File blob with the fileName and set it as the img src
          const imgSrc = URL.createObjectURL(fileBlob);
          const fileSizeInBytes = fileBlob.size;
          const fileSizeInKB = Math.round(fileSizeInBytes / 1024);
          imgThumb = `<a class="fileThumb" href="javascript:void(0);" target="_blank">
            <img src="${imgSrc}" alt="${fileSizeInKB} KB" style="width: 125px;" loading="lazy">
          </a>`;
        }

        fileInfo = `<div class="file">
        <div class="fileText">
          <span class="file-info">
            <a href="javascript:void(0);" target="_blank">${fileName}</a>
          </span>
          </div>
          ${imgThumb}
        </div>`
      }

      // Set the innerHTML of the postContainer element with the provided HTML, replacing the message content
      postContainer.innerHTML = `
        <div class="post reply" style="border: 1px dotted yellow;">
          <div class="postInfoM mobile">
            <span class="nameBlock"><span class="name">Anonymous</span><br /></span>
          </div>
          <div class="postInfo desktop">
            <input type="checkbox" name="51464347" value="delete" /> <span class="nameBlock"><span class="name">Anonymous</span> </span> <span class="dateTime" title="This post will not be submitted until the page number that is shown" >
            Page ${pageNum}
            </span>
            <span class="postNum desktop"><a href="#fp${post.mockNumber}" title="Link to this post">No.</a><a href="javascript:void(0);" title="You can't reply to a future post">Pending</a></span>
            <a class="menu-button delete-future-post" href="javascript:void(0);"><i class="fa fa-times"></i></a>
          </div>
          ${fileInfo}
          <blockquote class="postMessage" style="min-width: 300px">
            ${post.message.replace(/\n/g, '<br>')}
            <br />
            <br />
            <strong style="color: red;">(Only visible to you)</strong>
          </blockquote>
        </div>
      `;

      // Append the new postContainer element to the thread div
      threadDiv.appendChild(postContainer);

      postContainer.querySelector('.delete-future-post').addEventListener('click', function(e) {
        e.preventDefault();
        const confirmation = confirm('Remove this future post?');
        if (confirmation) {
          removeFuturePost(post.mockNumber)
        }
      });
    });

    // Append checkbox to qrElement
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    const futurePostHtml = `<div>
            Delay Post?
            <input type="checkbox" id="fp-checkbox" />
            Page:
            <select id="fp-page-num" required disabled>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6" selected>6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
            </select>
      </div>
    `;
    $(qrElement).append(futurePostHtml);

    $(document).on('change', '#fp-checkbox', function() {
      if($(this).is(":checked")) {
        $('#fp-page-num').prop('disabled', false);
        // Check if fakeButton already exists in the DOM
        if (document.querySelector('#future-post')) {
          // If it does, simply show it
          fakeButton.style.display = "inline";
        } else {
          // Otherwise, add it to the DOM
          $(originalButton).after(fakeButton);
        }
        originalButton.style.display = 'none';
      } else {
        $('#fp-page-num').prop('disabled', true);
        // Replace the fake button with the original one
        fakeButton.style.display = "none";
        originalButton.style.display = "inline";
      }
    });

    startIdleStats();
}

function startIdleStats() {
  let lastUpdateTime = Date.now();
  let changeDurations = []; // keep track of all durations between changes

  // Create a callback function to be executed whenever a mutation is observed
  const callback = function(mutationsList, observer) {
      for(let mutation of mutationsList) {
          if (mutation.type === 'childList') {
              let currentTime = Date.now();
              let duration = currentTime - lastUpdateTime;
              lastUpdateTime = currentTime;
              changeDurations.push(duration);
              dispatchIdleMetricsUpdate(); // dispatch event when metrics change
          }
      }
  };

  // Create an observer instance linked to the callback function
  let observer = new MutationObserver(callback);

  // Start observing the 'page-count' node for configured mutations
  let targetNode = document.getElementById('page-count');
  observer.observe(targetNode, { childList: true, subtree: true });

  // Calculate the weighted average change duration
  function calculateWeightedAverageDuration() {
      let weightedSum = 0;
      let totalWeight = 0;
      for(let i = 0; i < changeDurations.length; i++) {
          let weight = i + 1; // more recent changes have a larger weight
          weightedSum += changeDurations[i] * weight;
          totalWeight += weight;
      }
      let average = weightedSum / totalWeight;
      return average / 60000; // convert from ms to minutes
  }

  // Calculate the approximate time before the thread hits page 11
  function calculateIdleTimeBeforePageEleven() {
      let weightedAvg = calculateWeightedAverageDuration();
      let totalBumpTime = 0;
      for (let page in pageQueues) {
          totalBumpTime += pageQueues[page].length * page * weightedAvg;
      }
      let totalPageChanges = 11;
      let approximateTime = totalPageChanges * weightedAvg + totalBumpTime;
      return approximateTime;
  }

  // Dispatch an event with the updated idle metrics
  function dispatchIdleMetricsUpdate() {
      let event = new CustomEvent('idleMetricsUpdate', {
          detail: {
              idleTimeBeforePageEleven: calculateIdleTimeBeforePageEleven(),
              weightedAvgDuration: calculateWeightedAverageDuration(),
          }
      });
      window.dispatchEvent(event);
  }

  window.addEventListener('idleMetricsUpdate', function(e) {
      let idleTimeBeforePageEleven = e.detail.idleTimeBeforePageEleven;
      let hours = Math.floor(idleTimeBeforePageEleven / 60);
      let minutes = Math.floor(idleTimeBeforePageEleven % 60);
      let weightedAvgDuration = e.detail.weightedAvgDuration.toFixed(2); // rounded to 2 decimal places

      // Display the report in the console with a label for easy filtering
      console.log(
          `%cIdle Metrics Report:\n\n` +
          `Idle time before page 11: ${hours} hour(s) and ${minutes} minute(s)\n` +
          `Weighted average duration: ${weightedAvgDuration} minute(s)`,
          'color: green; font-weight: bold;'
      );
  });
}

// Initialize the extension
document.addEventListener('QRDialogCreation', function(e) {
  initExtension();
}, false);
