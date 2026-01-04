// ==UserScript==
// @name           IgnBoards - Thread Analytics
// @namespace      Violentmonkey Scripts
// @description    Counts and displays the number of posts made by each user in a specific IgnBoards thread.
// @author         Magof
// @version        1.0
// @license        MIT 
// @match          https://www.ignboards.com/threads/*
// @grant          GM_addStyle
// @grant          GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/542875/IgnBoards%20-%20Thread%20Analytics.user.js
// @updateURL https://update.greasyfork.org/scripts/542875/IgnBoards%20-%20Thread%20Analytics.meta.js
// ==/UserScript==

const style = `
  .loader {
    width: 100%;
    height: 30px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9999;
    background-color: #f5f5f5;
    overflow: hidden;
  }
  .loader-bar {
    height: 100%;
    width: 0;
    background-color: #4caf50;
    animation: progress 3s linear infinite;
  }
  @keyframes progress {
    0% { width: 0; }
    100% { width: 100%; }
  }
  .loader-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 14px;
    color: #333;
    white-space: nowrap;
  }
  .scrape-button {
    display: inline-block;
    padding: 8px 15px;
    background-color: #6c757d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    text-align: center;
    text-decoration: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: background-color 0.3s ease;
  }
  .scrape-button:hover {
    background-color: #5a6268;
  }
  .scrape-button:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

GM_addStyle(style);

// Variáveis globais
let isProcessing = false;
let totalPages = 0;
let currentPageNum = 0;

function createScrapeButton() {
  const headerInner = document.querySelector('.uix_headerInner--opposite');
  if (!headerInner) return;

  const button = document.createElement('button');
  button.textContent = 'Analyze Thread';
  button.className = 'scrape-button';
  button.id = 'scrape-button';
  button.onclick = startScraping;
  headerInner.appendChild(button);
}

async function fetchPage(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch page: ${response.status} ${response.statusText}`);
    }
    const body = await response.text();
    return new DOMParser().parseFromString(body, 'text/html');
  } catch (error) {
    console.error(`Erro ao buscar página ${url}:`, error);
    throw error;
  }
}

function getTotalPages(doc) {
  const pageNavElement = doc.querySelector('.pageNav-main');
  if (!pageNavElement) return 1;

  const pageLinks = pageNavElement.querySelectorAll('a[data-page]');
  if (pageLinks.length === 0) return 1;

  const pageNumbers = Array.from(pageLinks).map(link => parseInt(link.getAttribute('data-page')));
  return Math.max(...pageNumbers);
}

function updateLoader(currentPage, totalPages, text) {
  const loaderText = document.querySelector('.loader-text');

  if (loaderText) {
    loaderText.textContent = text || `Analyzing page ${currentPage}...`;
  }
}

async function extractPostData(url, currentPage = 1, processedPosts = new Set()) {
  try {
    const doc = await fetchPage(url);

    if (currentPage === 1) {
      totalPages = getTotalPages(doc);
    }

    updateLoader(currentPage, totalPages);

    // Seletor para posts
    const posts = doc.querySelectorAll('article.message div.message-userDetails');
    const postData = {};

    posts.forEach(post => {
      // Verificar se já processamos este post
      const postArticle = post.closest('article.message');
      const postId = postArticle?.getAttribute('data-content') || postArticle?.id;

      if (postId && processedPosts.has(postId)) {
        return; // Pular posts já processados
      }

      if (postId) {
        processedPosts.add(postId);
      }

      // Seletor para username
      const userElement = post.querySelector('a.username') ||
                         post.querySelector('.username span') ||
                         post.querySelector('h4.message-name span') ||
                         post.querySelector('[data-user-id]');

      let username = userElement ? userElement.textContent.trim() : 'Deleted member';

      // Limpar username de caracteres especiais se necessário
      username = username.replace(/\s+/g, ' ').trim();

      postData[username] = (postData[username] || 0) + 1;
    });

    // Verificar se há próxima página
    const nextPageElement = doc.querySelector('.pageNav-jump.pageNav-jump--next');
    const nextPage = nextPageElement ? nextPageElement.getAttribute('href') : null;

    if (nextPage) {
      const nextUrl = `https://www.ignboards.com${nextPage}`;
      currentPage++;

      // Delay de 1 segundo entre requisições
      await new Promise(resolve => setTimeout(resolve, 1000));

      const nextPostData = await extractPostData(nextUrl, currentPage, processedPosts);

      // Combinar dados das páginas
      for (const [user, count] of Object.entries(nextPostData)) {
        postData[user] = (postData[user] || 0) + count;
      }
    }

    return postData;

  } catch (error) {
    console.error(`Erro na página ${currentPage}:`, error);
    updateLoader(currentPage, totalPages, `Error on page ${currentPage}. Continuing...`);

    // Em caso de erro, retornar dados coletados até agora
    return {};
  }
}

function displayPostData(postData) {
  const sortedData = Object.entries(postData).sort((a, b) => b[1] - a[1]);
  const totalPosts = sortedData.reduce((sum, [, count]) => sum + count, 0);
  const totalUsers = sortedData.length;

  // Função para converter data to BBCode
  function convertToBBCode(data) {
    return data.map(([user, count]) => `[tr][td]${user}[/td][td]${count}[/td][/tr]`).join('\n');
  }

  const bbcodeContent = `[table]
[tr][th]User[/th][th]Posts[/th][/tr]
${convertToBBCode(sortedData)}
[/table]

[b]Total Posts:[/b] ${totalPosts}
[b]Total Users:[/b] ${totalUsers}`;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Thread Analysis Report</title>
      <!-- Bootstrap CSS -->
      <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/css/bootstrap.min.css" rel="stylesheet">
      <style>
        body {
          padding: 20px;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
        }
        h1 {
          margin-bottom: 20px;
          text-align: center;
        }
        .bbcode-area {
          margin-bottom: 20px;
        }
        .stats {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .copy-success {
          color: #28a745;
          font-weight: bold;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Thread Analysis Report</h1>

        <div class="stats">
          <div class="row">
            <div class="col-md-6">
              <strong>Total Posts:</strong> ${totalPosts}
            </div>
            <div class="col-md-6">
              <strong>Total Users:</strong> ${totalUsers}
            </div>
          </div>
        </div>

        <div class="bbcode-area">
          <h4>Export Code:</h4>
          <textarea id="bbcode" class="form-control" rows="12" readonly>${bbcodeContent}</textarea>
          <button class="btn btn-primary mt-3" onclick="copyBBCode()">Copy for Forum</button>
          <span id="copy-status" class="ml-2"></span>
        </div>

        <div class="table-responsive">
          <table class="table table-striped">
            <thead class="thead-dark">
              <tr>
                <th>#</th>
                <th>Username</th>
                <th>Posts</th>
                <th>%</th>
              </tr>
            </thead>
            <tbody>
              ${sortedData.map(([user, count], index) => {
                const percentage = ((count / totalPosts) * 100).toFixed(1);
                return `<tr>
                  <td>${index + 1}</td>
                  <td>${user}</td>
                  <td>${count}</td>
                  <td>${percentage}%</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bootstrap JS and dependencies -->
      <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@1.16.1/dist/umd/popper.min.js"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.0/js/bootstrap.min.js"></script>
      <script>
        function copyBBCode() {
          const bbcodeTextarea = document.getElementById('bbcode');
          const copyStatus = document.getElementById('copy-status');

          bbcodeTextarea.select();
          bbcodeTextarea.setSelectionRange(0, 99999); // Para mobile

          try {
            document.execCommand('copy');
            copyStatus.textContent = 'Copied!';
            copyStatus.className = 'copy-success';
            setTimeout(() => {
              copyStatus.textContent = '';
              copyStatus.className = '';
            }, 2000);
          } catch (err) {
            console.error('Failed to copy: ', err);
            copyStatus.textContent = 'Failed to copy';
            copyStatus.style.color = '#dc3545';
          }
        }
      </script>
    </body>
    </html>
  `;

  const newTab = window.open();
  newTab.document.open();
  newTab.document.write(html);
  newTab.document.close();
}

async function startScraping() {
  if (isProcessing) return;

  isProcessing = true;
  const button = document.getElementById('scrape-button');

  // Desabilitar botão durante processamento
  if (button) {
    button.disabled = true;
    button.textContent = 'Analyzing...';
  }

  const url = window.location.href;
  const loader = createLoader();

  // Reset variáveis globais
  totalPages = 0;
  currentPageNum = 0;

  try {
    updateLoader(1, 0, 'Initializing...');
    const postData = await extractPostData(url, 1);

    document.body.removeChild(loader);
    displayPostData(postData);

  } catch (error) {
    console.error('Erro durante o scraping:', error);
    document.body.removeChild(loader);
    alert('An error occurred while processing. Check console for details.');
  } finally {
    isProcessing = false;

    // Reabilitar botão
    if (button) {
      button.disabled = false;
      button.textContent = 'Analyze Thread';
    }
  }
}

function createLoader() {
  const loader = document.createElement('div');
  loader.className = 'loader';
  loader.innerHTML = `
    <div class="loader-bar"></div>
    <div class="loader-text">Initializing...</div>
  `;
  document.body.appendChild(loader);
  return loader;
}

// Inicializar botão quando a página carregar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', createScrapeButton);
} else {
  createScrapeButton();
}